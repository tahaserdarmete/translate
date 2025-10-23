import {ArrowRight, Volume2} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {setText} from "../redux/slices/translateSlice";
import Loader from "./loader";

const TextContainer = () => {
  const {textToTranslate, translatedText, sourceLang, targetLang, isLoading} =
    useSelector((store) => store.translateReducer);
  const dispatch = useDispatch();

  // Temizle butonu
  const handleClear = () => {
    dispatch(setText(""));
  };

  // Kopyala butonu
  const handleCopy = () => {
    window.navigator.clipboard.writeText(translatedText);
  };

  // Çevrilecek metni seslendir
  const handleSpeakSource = () => {
    if (!textToTranslate) return;

    // mevcut seslendirmeyi durdur
    window.speechSynthesis.cancel();

    // SpeechSynthesisUtterance : seslendirilecek metni ve ayarlarını tutan bir nesne oluşturur. Parametre olarak seslendirilecek metni alır. Ayar olarakta seslendirilecek dil, ses tonu ve ses hızı özelliklerini alır.
    const utterance = new SpeechSynthesisUtterance(textToTranslate);

    // utterance.lang ile seslendirilecek dili/aksanı seçiyoruz.
    if (sourceLang.value) {
      utterance.lang = sourceLang.value;
      // utterance.pitch = 1; 0-5 arasında değer alır. Ses tonu ayarını yapar.
    }

    // bu yöntem ile tarayıcının seslendirme özelliği ile seslendiriyoruz. speechSynthesis ses sentezleme
    window.speechSynthesis.speak(utterance);
  };

  // Çevrilmiş metni seslendir
  const handleSpeakTarget = () => {
    if (!translatedText) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(translatedText);

    utterance.lang = targetLang.value;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex gap-4 mt-6 lg:gap-8 flex-col lg:flex-row">
      {/* Çevrilcek Metin */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-zinc-300">Çevrilecek Metin</label>

          {textToTranslate && (
            <div className="flex items-center gap-3">
              <button
                disabled={!sourceLang.value}
                onClick={handleSpeakSource}
                className="text-xs text-zinc-400 hover:text-zinc-300 flex gap-2 disabled:text-zinc-500 disabled:cursor-not-allowed"
              >
                <Volume2 className="size-4" />
                Seslendir
              </button>
              <button
                onClick={handleClear}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Temizle
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <textarea
            value={textToTranslate}
            className="textarea"
            placeholder="Çevirmek istediğiniz metni buraya yazınız..."
            onChange={(e) => dispatch(setText(e.target.value))}
          ></textarea>
          <div className="absolute bottom-2 right-2 text-xs text-zinc-500">
            {textToTranslate.length} karakter
          </div>
        </div>
      </div>

      {/* Icon */}
      <div className="flex items-center justify-center lg:flex-col">
        <div className="size-8 lg:size-12 bg-blue-600 rounded-full grid place-items-center">
          <ArrowRight className="size-4 lg:size-6 max-lg:rotate-90" />
        </div>
      </div>

      {/* Çevrilmiş Metin */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-zinc-300">Çevrilmiş Metin</label>

          {translatedText && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSpeakTarget}
                className="text-xs text-zinc-400 hover:text-zinc-300 flex gap-2"
              >
                <Volume2 className="size-4" />
                Seslendir
              </button>

              <button
                onClick={handleCopy}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Kopyala
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <textarea
            className="textarea text-gray-300"
            disabled
            value={isLoading ? "" : translatedText}
          ></textarea>

          {isLoading && <Loader />}

          {!isLoading && !translatedText && !textToTranslate && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-zinc-500 text-sm">Çeviri bekleniyor</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextContainer;
