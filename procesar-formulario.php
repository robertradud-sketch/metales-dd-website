<?php

header('Content-Type: application/json; charset=utf-8');

//  ---Configuracion---
$destinatario = 'info@metalesdd.es';
$asunto_base = 'Nueva solicitud de presupuesto - Web';


function responder($ok, $mensaje) {
    echo json_encode(['ok' => $ok, 'mensaje' => $mensaje]);
    exit;
}

// Solo aceptar peticiones POST
if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    http_response_code(405);
    responder(false, 'Método no permitido.');
}

// Honeypot anti-spam: si el campo oculto "web viene relleno, es un bot.
if(!empty($_POST['web'])) {
    //Respondemos "ok" para no dar pistas a los bots, pero no enviamos nada.
    responder(true, 'Gracias, hemos recibido tu mensaje.');
}

// --- Recogida y limpieza de datos ---
function limpiar($valor){
    $valor = trim($valor ?? '');
    // Elimina saltos de linea y retornos de carro para evitar inyeccion de cabeceras
    $valor = str_replace(["\r","\n"], ' ', $valor);
    return htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
}

$nombre = limpiar($_POST['nombre'] ?? '');
$telefono = limpiar($_POST['telefono'] ?? '');
$email = trim($_POST['email'] ?? '');
$servicio = limpiar($_POST['servicio'] ?? '');
$mensaje = trim($_POST['mensaje'] ?? '');

// --- Validacion ---
$errores = [];

if($nombre === '' || mb_strlen($nombre) > 100){
    $errores[] = 'nombre';
}
if($telefono === '' || !preg_match('/^[0-9\s\+\-\(\)]{6,20}$/', $telefono)) {
    $errores[] = 'telefono';
}
if($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)){
    $errores[] = 'email';
}
if($servicio === ''){
    $errores[] = 'servicio';
}
if(trim($mensaje) === '' || mb_strlen($mensaje) > 3000) {
    $errores[] = 'mensaje';
}

if(!empty($errores)) {
    responder(false, 'Revisa estos campos: ' . implode(', ', $errores) . ' .');
}

$mensaje_limpio = htmlspecialchars(str_replace(["\r\n", "\r"], "\n", $mensaje), ENT_QUOTES, 'UTF-8');

// --- Construccion del email ---
$asunto = '=?UTF-8?B?' . base64_encode($asunto_base . ' - ' . $servicio) . '?=';

$cuerpo = "Nueva solicitud recibida desde la web:\n\n";
$cuerpo .= "Nombre: {$nombre}\n";
$cuerpo .= "Teléfono: {$telefono}\n";
$cuerpo .= "Email: {$email}\n";
$cuerpo .= "Servicio: {$servicio}\n\n";
$cuerpo .= "Mensaje:\n{$mensaje_limpio}\n";

$cabeceras = [];
$cabeceras[] = 'MIME-Version: 1.0';
$cabeceras[] = 'Content-Type: text/plain; charset=UTF-8';
$cabeceras[] = 'From: Web Metales DD <no-reply@metalesdd.es>';
$cabeceras[] = "Reply-To: {$nombre} <{$email}>";

$enviado = mail($destinatario, $asunto, $cuerpo, implode("\r\n", $cabeceras));

if($enviado){
    responder(true, '¡Gracias! Hemos recibido tu solicitud y te contactaremos en menos de 24h laborables.');

}
else{
    responder(false, 'No se ha podido enviar el mensaje. Prueba de nuevo o llámanos directamente.');
}
