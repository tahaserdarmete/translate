import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../utils/api";

// Dil verilerini çeken thunk fonksiyonu
const getLanguages = createAsyncThunk("langeage/getLanguages", async () => {
  // api isteği at
  const res = await api.get("/languages");

  //   Action'un payload'ını belirledik
  return res.data.languages;
});

// Çeviri işlemini gerçekleştirecek thunk fonksiyon
const translateText = createAsyncThunk(
  "translate/translateText",
  async (_, {getState}) => {
    // thunk aksiyonu içerisinden store'da tutulan veriye eriş
    const {translateReducer} = getState();

    // API' ya çeviri için istek at
    const res = await api.post("", {
      q: translateReducer.textToTranslate,
      source: translateReducer.sourceLang.value,
      target: translateReducer.targetLang.value,
    });

    //   Action payload return et
    return res.data.data.translations.translatedText[0];
  }
);

export {getLanguages, translateText};
