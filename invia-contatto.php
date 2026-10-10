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

// =========================================
// CLOUDFLARE TURNSTILE - VERIFICA ANTISPAM
// =========================================

// Recupera il token generato da Cloudflare.
$turnstileToken = leggiCampo('cf-turnstile-response');

// Senza token la richiesta viene rifiutata.
if (
    $turnstileToken === '' ||
    strlen($turnstileToken) > 2048
) {
    tornaAlModulo('errore');
}

// Carica la chiave privata dall'esterno di public_html.
$configPath = dirname(__DIR__) . '/turnstile-config.php';

if (!is_file($configPath)) {
    error_log('Turnstile: configurazione mancante.');
    tornaAlModulo('errore');
}

$turnstileSecret = require $configPath;

if (
    !is_string($turnstileSecret) ||
    $turnstileSecret === ''
) {
    tornaAlModulo('errore');
}

// Controlla che PHP possa contattare Cloudflare.
if (!function_exists('curl_init')) {
    error_log('Turnstile: estensione cURL non disponibile.');
    tornaAlModulo('errore');
}

// Invia il token a Cloudflare per la verifica.
$curl = curl_init(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify'
);

curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'secret' => $turnstileSecret,
        'response' => $turnstileToken
    ]),
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 10
]);

$risposta = curl_exec($curl);

$httpCode = curl_getinfo(
    $curl,
    CURLINFO_HTTP_CODE
);

curl_close($curl);

// Interpreta la risposta di Cloudflare.
$verifica = is_string($risposta)
    ? json_decode($risposta, true)
    : null;

// Accetta soltanto verifiche valide per il sito di prova.
if (
    $httpCode !== 200 ||
    !is_array($verifica) ||
    ($verifica['success'] ?? false) !== true ||
    ($verifica['hostname'] ?? '') !== 'test.creationweb.it' ||
    ($verifica['action'] ?? '') !== 'contatti'
) {
    tornaAlModulo('errore');
}

// Verifica superata: il PHP può procedere con l'email.

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