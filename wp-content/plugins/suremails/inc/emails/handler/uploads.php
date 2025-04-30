<?php
/**
 * Uploads.php
 *
 * Provides methods for handling file operations for email attachments and uploads.
 *
 * @package SureMails\Inc\Utilities
 */

namespace SureMails\Inc\Emails\Handler;

use SureMails\Inc\Traits\Instance;
use WP_Error;

/**
 * Class Uploads
 *
 * Provides methods for handling file operations for email attachments and uploads.
 */
class Uploads {

	use Instance;

	/**
	 * Directory name for SureMails uploads.
	 *
	 * @since 1.5.0
	 */
	public const BASE_FOLDER = 'suremails';

	/**
	 * Process and update a list of file attachments.
	 *
	 * @since 1.5.0
	 *
	 * @param array $attachments List of attachment information.
	 * @return array Modified attachment list.
	 */
	public function handle_attachments( $attachments ) {
		return array_map(
			function ( $attachment ) {
				// Unpack our attachment parameters.
				$path      = $attachment;
				$filename  = wp_basename( $path );
				$is_string = false;

				$new_path = $this->handle_single_attachment( $path, $filename, $is_string );
				if ( ! empty( $new_path ) ) {
					$attachment = $new_path;
				}

				return $attachment;
			},
			$attachments
		);
	}

	/**
	 * Retrieve the base SureMails uploads directory.
	 *
	 * @since 1.5.0
	 *
	 * @return array|WP_Error Array with 'path' and 'url' or an error.
	 */
	public static function get_suremails_base_dir() {
		$upload_info = wp_upload_dir();
		if ( ! empty( $upload_info['error'] ) ) {
			return new WP_Error( 'suremails_upload_dir_error', $upload_info['error'] );
		}

		$folder = self::BASE_FOLDER;

		$base_dir = realpath( $upload_info['basedir'] );
		if ( $base_dir === false ) {
			return new WP_Error( 'suremails_upload_dir_error', __( 'Invalid upload base directory.', 'suremails' ) );
		}
		$base   = trailingslashit( $base_dir ) . $folder;
		$custom = apply_filters( 'suremails_uploads_base_dir', $base );

		if ( wp_is_writable( $custom ) ) {
			$base = $custom;
		}

		if ( ! file_exists( $base ) && ! wp_mkdir_p( $custom ) ) {
			return new WP_Error(
				'suremails_upload_dir_create_failed',
				// translators: %s is the directory path.
				sprintf( __( 'Cannot create directory %s. Check parent directory permissions.', 'suremails' ), esc_html( $base ) )
			);
		}

		if ( ! wp_is_writable( $custom ) ) {
			return new WP_Error(
				'suremails_upload_dir_not_writable',
				// translators: %s is the directory path.
				sprintf( __( 'Directory %s is not writable.', 'suremails' ), esc_html( $base ) )
			);
		}

		return [
			'path' => $base,
			'url'  => trailingslashit( $upload_info['baseurl'] ) . $folder,
		];
	}

	/**
	 * Generate an .htaccess file to secure the uploads folder.
	 *
	 * @since 1.5.0
	 *
	 * @return bool True on success, false on failure.
	 */
	public static function generate_htaccess_file() {
		$base_dir = self::get_suremails_base_dir();
		if ( is_wp_error( $base_dir ) ) {
			return false;
		}

		$ht_file = wp_normalize_path( trailingslashit( $base_dir['path'] ) . '.htaccess' );
		$content = apply_filters(
			'suremails_htaccess_content',
			'# Disable PHP and Python script execution.
<Files *>
  SetHandler none
  SetHandler default-handler
  RemoveHandler .cgi .php .php3 .php4 .php5 .phtml .pl .py .pyc .pyo
  RemoveType .cgi .php .php3 .php4 .php5 .phtml .pl .py .pyc .pyo
</Files>
<IfModule mod_php5.c>
  php_flag engine off
</IfModule>
<IfModule mod_php7.c>
  php_flag engine off
</IfModule>
<IfModule mod_php8.c>
  php_flag engine off
</IfModule>
<IfModule headers_module>
  Header set X-Robots-Tag "noindex"
</IfModule>'
		);
		if ( function_exists( 'insert_with_markers' ) === false ) {
			require_once ABSPATH . 'wp-admin/includes/misc.php';
		}
		return insert_with_markers( $ht_file, 'SureMails', $content );
	}

	/**
	 * Create an empty index.html file in the specified folder if missing.
	 *
	 * @since 1.5.0
	 *
	 * @param string $folder_path The directory in which to create the file.
	 * @return int|false Number of bytes written or false on failure.
	 */
	public static function generate_index_html( $folder_path ) {
		if ( ! is_dir( $folder_path ) || is_link( $folder_path ) ) {
			return false;
		}
		$index = wp_normalize_path( trailingslashit( $folder_path ) . 'index.html' );
		// If the index file already exists, do nothing.
		if ( file_exists( $index ) ) {
			return false;
		}

		// Initialize the WP Filesystem.
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		global $wp_filesystem;
		if ( empty( $wp_filesystem ) ) {
			WP_Filesystem();
		}
		return $wp_filesystem->put_contents( $index, '' );
	}

	/**
	 * Process a single attachment file by obfuscating its path and saving its data.
	 *
	 * @since 1.5.0
	 *
	 * @param string $path       The original file path or content.
	 * @param string $filename   The original file name.
	 * @param bool   $is_string  Indicates if the attachment is provided as a string.
	 * @return string|false New file path if stored successfully; false otherwise.
	 */
	private function handle_single_attachment( $path, $filename = '', $is_string = false ) {
		$content = $this->fetch_attachment_content( $path, $is_string );
		if ( $content === false ) {
			return false;
		}

		// When not a string-based attachment, use the original file name if none provided.
		if ( ! $is_string && $filename === '' ) {
			$filename = wp_basename( $path );
		}

		$filename = sanitize_file_name( $filename );
		$stored   = $this->save_file( $content, $filename );
		return empty( $stored ) ? $path : $stored;
	}

	/**
	 * Retrieve the content from a given file or string.
	 *
	 * @since 1.5.0
	 *
	 * @param string $source    The file path or the file content.
	 * @param bool   $is_string Whether the source is a string of content.
	 * @return string|false File content or false on failure.
	 */
	private function fetch_attachment_content( $source, $is_string ) {
		if ( ! $is_string ) {
			if ( ! is_readable( $source ) ) {
				return false;
			}
			return file_get_contents( $source );
		}
		return $source;
	}

	/**
	 * Save file content to a new location inside the SureMails uploads directory.
	 *
	 * @since 1.5.0
	 *
	 * @param string $content       The file data.
	 * @param string $original_name The original file name.
	 * @return string|false New file path on success or false on failure.
	 */
	private function save_file( $content, $original_name ) {
		$upload_dir = $this->get_uploads_folder();

		if ( is_wp_error( $upload_dir ) ) {
			return false;
		}

		if ( ! is_dir( $upload_dir ) ) {
			wp_mkdir_p( $upload_dir );

			// Create security and index files in the upload directories.
			self::generate_htaccess_file();
			$base_dir = Uploads::get_suremails_base_dir();
			if ( ! is_wp_error( $base_dir ) && isset( $base_dir['path'] ) ) {
				self::generate_index_html( $base_dir['path'] );
			}
			self::generate_index_html( $upload_dir );
		}

		// Get the extension from the original file name.
		$extension = pathinfo( $original_name, PATHINFO_EXTENSION );

		// Compute a hash of the content.
		$hash = hash( 'md5', $content );

		$new_name = substr( $hash, 0, 16 ) . '-' . basename( $original_name );

		$upload_dir = trailingslashit( $upload_dir );
		$new_path   = $upload_dir . $new_name;

		if ( is_file( $new_path ) ) {
			return $new_path;
		}

		// Ensure the upload directory is writable using the WP helper.
		if ( ! wp_is_writable( $upload_dir ) ) {
			return false;
		}

		// Initialize the WP Filesystem.
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		global $wp_filesystem;
		if ( empty( $wp_filesystem ) ) {
			WP_Filesystem();
		}

		$result = $wp_filesystem->put_contents( $new_path, $content, FS_CHMOD_FILE );
		return $result ? $new_path : false;
	}

	/**
	 * Get the SureMails-specific uploads folder.
	 *
	 * @since 1.5.0
	 *
	 * @return string|WP_Error The absolute folder path or error.
	 */
	private function get_uploads_folder() {
		$base = self::get_suremails_base_dir();
		if ( is_wp_error( $base ) ) {
			return $base;
		}
		return trailingslashit( trailingslashit( $base['path'] ) . 'attachments' );
	}
}
