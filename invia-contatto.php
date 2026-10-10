<?php
declare(strict_types=1);

/*
 * CREATIONWEB — MODULO CONTATTI
 * Prima configurazione per test su SiteGround.
 */

header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    exit('Metodo non consentito.');
}

session_start([
    'cookie_httponly' => true,
    'cookie_secure' => true,
    'cookie_samesite' => 'Lax'
]);

function tornaAlModulo(string $esito): never
{
    header(
        'Location: /?contatto=' . $esito . '#contactForm',
        true,
        303
    );
    exit;
}

function leggiCampo(string $nome): string
{
    $valore = $_POST[$nome] ?? '';

    if (!is_string($valore)) {
        return '';
    }

    return trim(
        preg_replace('/[\r\n]+/', ' ', $valore)
    );
}

// Protezione antispam: campo che deve rimanere vuoto.
if (leggiCampo('website') !== '') {
    tornaAlModulo('ok');
}

// Limita gli invii ripetuti nella stessa sessione.
$ultimoInvio = (int) ($_SESSION['ultimo_invio'] ?? 0);

if ($ultimoInvio > 0 && time() - $ultimoInvio < 60) {
    tornaAlModulo('attendi');
}

// Recupera i dati.
$nome = leggiCampo('nome');
$telefono = leggiCampo('telefono');
$attivita = leggiCampo('attivita');
$privacy = leggiCampo('privacy');

// Validazione lato server.
$telefonoValido = preg_match(
    '/^\+?[0-9][0-9\s().-]{5,24}$/',
    $telefono
);

if (
    $nome === '' ||
    strlen($nome) > 120 ||
    $attivita === '' ||
    strlen($attivita) > 150 ||
    !$telefonoValido ||
    $privacy !== '1'
) {
    tornaAlModulo('errore');
}

// Indirizzo che riceverà le richieste.
$destinatario = 'creationwebmail@gmail.com';

$oggetto = 'Nuova richiesta dal sito CreationWeb';

// Testo della notifica.
$messaggio =
    "NUOVA RICHIESTA DI CONTATTO\n\n" .
    "Nome e cognome: " . $nome . "\n" .
    "Telefono: " . $telefono . "\n" .
    "Attivita: " . $attivita . "\n\n" .
    "Informativa dichiarata come letta: SI\n";

// Intestazioni dell'email.
$headers = [
    'From: CreationWeb <info@creationweb.it>',
    'Content-Type: text/plain; charset=UTF-8'
];

// Tentativo di invio.
$inviata = mail(
    $destinatario,
    $oggetto,
    $messaggio,
    implode("\r\n", $headers)
);

if ($inviata) {
    $_SESSION['ultimo_invio'] = time();
    tornaAlModulo('ok');
}

tornaAlModulo('errore');