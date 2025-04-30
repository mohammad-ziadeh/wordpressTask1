<?php
/**
 * Handles divi integration related functionality.
 *
 * @package presto-player
 */

namespace PrestoPlayer\Integrations\Divi;

use PrestoPlayer\Models\ReusableVideo;
use PrestoPlayer\Models\Post;

/**
 * Handles divi-related functionality
 */
class Divi {

	/**
	 * Registers the Divi integration.
	 */
	public function register() {
		add_action( 'divi_extensions_init', array( $this, 'init' ) );
		add_action( 'wp_ajax_presto_get_media_attributes', array( $this, 'getMediaItemAttributes' ) );
	}

	/**
	 * Initializes the Divi integration.
	 */
	public function init() {
		// require our module.
		include_once 'includes/PrestoDiviExtension.php';

		// enqueue the scripts.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueueScripts' ) );

		// fix rankmath conflict.
		add_filter( 'script_loader_tag', array( $this, 'rankMathFix' ), 11, 3 );

		// parse the divi block to get the inner media hub block.
		add_filter( 'presto_player_get_block_from_content', array( $this, 'getInnerBlockFromDiviContent' ) );
	}

	/**
	 * Gets the inner media hub block from the divi content for lessons and topics.
	 *
	 * @param array $block the Divi block array.
	 *
	 * @return array $block the filtered media hub inner block array.
	 */
	public function getInnerBlockFromDiviContent( $block ) {
		// bail if block is empty.
		if ( empty( $block ) ) {
			return $block;
		}

		$pattern  = get_shortcode_regex( array( 'prpl_presto_player' ) );
		$block_id = false;
		if ( $block['innerHTML'] && preg_match( "/$pattern/", $block['innerHTML'], $matches ) ) {
			$shortcode = $matches[0] ?? '';
			if ( ! empty( $shortcode ) ) {
				$atts     = shortcode_parse_atts( $shortcode );
				$block_id = isset( $atts['video_id'] ) ? (int) $atts['video_id'] : false;
			}
		}
		if ( ! empty( $block_id ) ) {
			$post_model = new Post( get_post( $block_id ) );
			$block      = $post_model->getMediaHubBlockFromPost( $block_id );
			if ( ! empty( $block ) ) {
				return $block;
			}
		}
		return $block;
	}

	/**
	 * Fixes rankmath excluding wp-i18n script from iframe.
	 *
	 * @param string $tag    The <script> tag for the enqueued script.
	 * @param string $handle The script's registered handle.
	 * @param string $src    The script's source URL.
	 *
	 * @return string
	 */
	public function rankMathFix( $tag, $handle, $src ) {
		if ( 'wp-i18n' === $handle ) {
            return '<script type="text/javascript" src="' . $src . '"></script>' . "\n"; // phpcs:ignore
		}
		return $tag;
	}

	/**
	 * Get attributes to inject into JSX component
	 *
	 * @param int $id id of the media item.
	 * @return array|WP_Error
	 */
	public function getMediaItemAttributes( $id ) {
		\check_ajax_referer( 'et_admin_load_nonce' );

		$id = (int) $_POST['id'] ?? 0;

		if ( ! $id ) {
			return new \WP_Error( 'invalid', 'You must provide an id', array( 'status' => 400 ) );
		}

		$video = new ReusableVideo( $id );
		if ( ! $video ) {
			return false;
		}

		return wp_send_json_success( $video->getAttributes() );
	}

	/**
	 * Enqueues scripts for Divi integration.
	 */
	public function enqueueScripts() {
		if ( ! et_core_is_fb_enabled() ) {
			return;
		}

		$assets = include trailingslashit( PRESTO_PLAYER_PLUGIN_DIR ) . 'dist/divi.asset.php';
		wp_enqueue_script(
			'surecart/divi/admin',
			trailingslashit( PRESTO_PLAYER_PLUGIN_URL ) . 'dist/divi.js',
			array_merge( array( 'react-dom', 'jquery', 'hls.js' ), $assets['dependencies'] ),
			$assets['version'],
			true
		);
		wp_enqueue_style( 'surecart/divi/admin', trailingslashit( PRESTO_PLAYER_PLUGIN_URL ) . 'dist/divi.css', array(), $assets['version'] );

		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( 'surecart/divi/admin', 'presto-player' );
		}
	}
}
