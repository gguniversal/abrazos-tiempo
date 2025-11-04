import React, { useState, useMemo, useCallback } from 'react';
import type { PhotoData } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { generateMemoryImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';

type View = 'form' | 'loading' | 'result' | 'print';

const App: React.FC = () => {
  const [oldPhoto, setOldPhoto] = useState<PhotoData | null>(null);
  const [recentPhoto, setRecentPhoto] = useState<PhotoData | null>(null);
  const [name, setName] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('form');

  const handleOldPhotoUpload = useCallback(async (file: File) => {
    try {
      const photoData = await fileToBase64(file);
      setOldPhoto(photoData);
    } catch (err) {
      setError('Error al procesar la foto antigua.');
    }
  }, []);

  const handleRecentPhotoUpload = useCallback(async (file: File) => {
    try {
      const photoData = await fileToBase64(file);
      setRecentPhoto(photoData);
    } catch (err) {
      setError('Error al procesar la foto reciente.');
    }
  }, []);

  const isFormValid = useMemo(() => {
    return oldPhoto && recentPhoto;
  }, [oldPhoto, recentPhoto]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setError(null);
    setView('loading');

    try {
      const imageB64 = await generateMemoryImage(oldPhoto, recentPhoto, name);
      setGeneratedImage(`data:image/png;base64,${imageB64}`);
      setView('result');
    } catch (err) {
      console.error(err);
      setError('No se pudo generar la imagen. Por favor, inténtalo de nuevo.');
      setView('form');
    }
  };

  const handleReset = () => {
    setOldPhoto(null);
    setRecentPhoto(null);
    setName('');
    setGeneratedImage(null);
    setError(null);
    setView('form');
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
            <Spinner />
            <h2 className="text-2xl font-bold mt-6 text-sky-600 dark:text-sky-400">Creando tu memoria...</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Uniendo el pasado y el presente. Esto puede tardar un momento.</p>
          </div>
        );
      case 'result':
        return (
          <div className="w-full max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-6">¡Tu Memoria está Lista!</h2>
            {generatedImage && (
              <div className="mb-6">
                 <img src={generatedImage} alt="Memoria generada" className="rounded-lg shadow-2xl mx-auto" />
              </div>
            )}
            <div className="mt-6 p-4 bg-sky-100 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-700 rounded-lg">
                <p className="font-semibold text-sky-800 dark:text-sky-200">"Imprime esta imagen por solo S/5 en papel fotográfico A4"</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
                <a
                  href={generatedImage!}
                  download={`memoria_${name.toLowerCase().replace(/\s+/g, '_')}.png`}
                  className="w-full md:w-auto bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800 transition-all duration-300 shadow-lg text-center animate-pulse"
                >
                  Descargar Imagen
                </a>
                <button
                  onClick={() => setView('print')}
                  className="w-full md:w-auto bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 transition-all duration-300 shadow-lg"
                >
                  Lo Quiero Impreso
                </button>
                <button
                  onClick={handleReset}
                  className="w-full md:w-auto bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 shadow-lg"
                >
                  Crear Nueva Memoria
                </button>
            </div>
          </div>
        );
    case 'print':
        const whatsappNumber = "51955986375";
        const whatsappMessage = encodeURIComponent("Señores Imprimix: por favor imprimir esta imagen");
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        return (
            <div className="w-full max-w-4xl text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold mb-2 text-purple-700 dark:text-purple-400">Completa tu Pedido de Impresión</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">Sigue estos 2 sencillos pasos para recibir tu memoria impresa.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Columna Izquierda: Pasos de Pago y Envío */}
                    <div className="flex flex-col gap-8 text-left">
                        {/* Paso 1 */}
                        <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-2">Paso 1: Realiza el Pago</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Escanea el código para pagar S/5.00 con Yape.</p>
                            <img src="https://i.postimg.cc/J0dV0gYm/QR-ASR.webp" alt="Código QR de Yape" className="rounded-lg shadow-md mx-auto w-full max-w-xs" />
                            <p className="text-sm mt-4 text-slate-600 dark:text-slate-400 font-semibold text-center">(51) 955 986 375 - Arturo Sagastegui R.</p>
                        </div>
                        {/* Paso 2 */}
                        <div>
                           <h4 className="font-bold text-lg">Paso 2: Envíanos la Imagen y Voucher</h4>
                           <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Descarga tu memoria y envíala a nuestro WhatsApp junto con tu comprobante de pago.</p>
                           <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-lg">
                               <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.069l-1.2 4.368z"/></svg>
                               Enviar por WhatsApp
                           </a>
                        </div>
                    </div>
                     {/* Columna Derecha: Imagen */}
                    <div className="text-left">
                        <h3 className="text-xl font-bold mb-4">Tu Imagen:</h3>
                        {generatedImage && (
                            <img src={generatedImage} alt="Memoria generada" className="rounded-lg shadow-lg w-full" />
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={handleReset}
                        className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 shadow-lg"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
      case 'form':
      default:
        return (
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <ImageUploader title="Foto Antigua (niño/a)" onImageUpload={handleOldPhotoUpload} imagePreviewUrl={oldPhoto?.dataUrl} />
              <ImageUploader title="Foto Reciente (adulto/a)" onImageUpload={handleRecentPhotoUpload} imagePreviewUrl={recentPhoto?.dataUrl} />
            </div>
            <div className="mb-8">
              <label htmlFor="name" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre para la imagen (Opcional)</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Alejandro"
                className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full md:w-auto bg-blue-800 text-white font-bold py-4 px-12 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:dark:bg-slate-600 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:transform-none"
              >
                Generar Memoria
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-sky-700 dark:text-sky-400">Abrazos del Tiempo</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Crea un recuerdo único uniendo tu pasado y tu presente.</p>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">Descárgalo o si lo prefieres Imprimix Press te lo imprime y lo manda por Delivery</p>
      </header>
      <main className="w-full flex justify-center">
        {renderContent()}
      </main>
       <footer className="text-center mt-12 text-slate-500 dark:text-slate-400 text-sm">
        <p>Generado con la magia de la IA de Google.</p>
      </footer>
    </div>
  );
};

export default App;