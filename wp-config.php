<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'reservationPress_db' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         ':oL!#`g)x!+9!gH#T3<D(b3w{dr]*LH_>huWV^r0)&hg~K=3:@ULf-^`pjs),#=?' );
define( 'SECURE_AUTH_KEY',  'OtVf};,r=TjvEbusA~XXAEPxQnft*XeuS7~&ru:UYXj|C$(aq(Jv`wOfJ3OX=g}E' );
define( 'LOGGED_IN_KEY',    'tuwv!n?lsr7Ga&aYQS4E[G[Z$KFZp@9;2}OG,SXy[g|{9x?h62*}y4K^S=.H!vV5' );
define( 'NONCE_KEY',        '(`R}/1.)*L>)tQgHSXY_DDu`VqRrCXAkg&?ex;)?<?xi:=3k<z~@O!}ch)^},o&}' );
define( 'AUTH_SALT',        'LOHq5aV^7_s:9D&F8m>nj0][|/ .uF?yOOXUUD8>bD6hn,}hitY(X68Jb/Em@G5c' );
define( 'SECURE_AUTH_SALT', '3S0b~Q9CO;~]RN}6])S`Qw[*KO&)7$YIc~n/}[*rS9?OxAEu$+fvV8_/hBN>Zz:w' );
define( 'LOGGED_IN_SALT',   'b$TY#LU2sOBn_R(eqh~V.O ~4A^:JZnv2o{ra&M7JV^2IYL)_Y7YOw?]EQ6I2nii' );
define( 'NONCE_SALT',       'GZ}9-A{CQP-?Mfn<q_Q?Q}v0rgwQ>P.?iU G90Gg60jiGLIh.N9X=?!>:X mrk`j' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
