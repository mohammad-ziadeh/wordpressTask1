<?php

namespace AmeliaBooking\Infrastructure\Services\Notification;

use AmeliaBooking\Domain\Services\Settings\SettingsService;

/**
 * Class MailerFactory
 *
 * @package AmeliaBooking\Infrastructure\Services\Notification
 */
class MailerFactory
{
    /**
     * Mailer constructor.
     *
     * @param SettingsService $settingsService
     *
     * @return MailgunService|PHPMailService|SMTPService|WpMailService
     */
    public static function create(SettingsService $settingsService)
    {
        $settings = $settingsService->getCategorySettings('notifications');

        if ($settings['mailService'] === 'smtp') {
            return new SMTPService(
                $settings['senderEmail'],
                $settings['senderName'],
                $settings['smtpHost'],
                $settings['smtpPort'],
                $settings['smtpSecure'],
                $settings['smtpUsername'],
                $settings['smtpPassword'],
                $settings['replyTo']
            );
        }

        if ($settings['mailService'] === 'mailgun') {
            return new MailgunService(
                $settings['senderEmail'],
                $settings['senderName'],
                $settings['mailgunApiKey'],
                $settings['mailgunDomain'],
                $settings['mailgunEndpoint'],
                $settings['replyTo']
            );
        }

        if ($settings['mailService'] === 'wp_mail') {
            return new WpMailService(
                $settings['senderEmail'],
                $settings['senderName'],
                $settings['replyTo']
            );
        }

        return new PHPMailService(
            $settings['senderEmail'],
            $settings['senderName'],
            $settings['replyTo']
        );
    }
}
