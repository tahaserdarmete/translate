import {ArrowLeftRight} from "lucide-react";
import Select from "react-select";
import {customStyles} from "../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {useMemo} from "react";
import {handleSwap, setSource, setTarget} from "../redux/slices/translateSlice";

const LanguageSelect = () => {
  const dispatch = useDispatch();

  const {isLoading, languages} = useSelector((store) => store.languageReducer);
  const {sourceLang, targetLang} = useSelector(
    (store) => store.translateReducer
  );

  /*
   * React select veriyi {value, label } olarak istiyor API'dan ise veriler {language. name} olarak geldiği için veriyi güncelleyeceğiz. Bu yöntemi map ile yapacağız. Çünkü map diziyi döner ve yeni bir dizi oluşturur.
   * language > value
   * name > label olacak
   */

  // useMemo kullanarak render anında hesaplamayı gerekszi yere tekrar yapmasının önüne geçtik. [languages] değeri ile sadece languages değerinin değişmesi durumunda hesaplama yapacak
  const formatted = useMemo(
    () =>
      languages.map((item) => ({
        value: item.language,
        label: item.name,
      })),
    [languages]
  );

  //   Dili algıla seçeneği
  const detect = {label: "Dili algıla"};

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-col lg:flex-row">
        {/* Kaynak Dil */}
        <div className="flex-1 w-full">
          <label className="block text-sm text-zinc-300 mb-2">Kaynak Dil</label>
          <Select
            value={sourceLang}
            isLoading={isLoading}
            isDisabled={isLoading}
            options={[detect, ...formatted]}
            onChange={(lang) => dispatch(setSource(lang))}
            styles={customStyles}
            className="text-sm text-black"
          />
        </div>

        {/* Değiştirme Butonu */}
        <div className="flex items-center justify-center">
          <button
            disabled={!sourceLang.value || isLoading}
            onClick={() => {
              dispatch(handleSwap());
            }}
            className="size-10 lg:size-12 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center cursor-pointer justify-center"
          >
            <ArrowLeftRight />{" "}
          </button>
        </div>

        {/* Hedef Dil */}
        <div className="flex-1 w-full">
          <label className="block text-sm text-zinc-300 mb-2">Hedef Dil</label>
          <Select
            value={targetLang}
            isLoading={isLoading}
            isDisabled={isLoading}
            options={formatted}
            onChange={(lang) => dispatch(setTarget(lang))}
            styles={customStyles}
            className="text-sm text-black"
          />
        </div>
      </div>

      {/* Dil Sayısı */}
      <div className="text-center">
        <p className="text-sm text-zinc-500">
          {" "}
          {languages.length} Dil Destekleniyor
        </p>
      </div>
    </div>
  );
};

export default LanguageSelect;
