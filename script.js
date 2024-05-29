// https://app.exchangerate-api.com/dashboard 


let key = 'b63a24fdfd65eef6920de168';
let urlForCodes = `https://v6.exchangerate-api.com/v6/${key}/codes`;

let resultBlock = document.querySelector('.result_info'); // блок с результами проведеной конвертации (opacity 0)
let amount = document.querySelector('.amount_inp'); // input для ввода суммы денег
let selects = document.querySelectorAll('select'); // select-ы для выбора из какой валюты в какую будет происходить конвертация
let sendRequestBtn = document.querySelector('.convert'); // кнопка
let currencyRatioInfo = document.querySelector('.info_text'); // инфа по курсу выбраных валют в select-ах

// сюда будут записываться коды валют из select-ов (USD, KZT, RUB);
let selectFrom = '';
let selectTo = '';

// получение блоков для вывода инфы об изменяемой валюте (блоки для аббревиатуры валюты, полного названия, и для значения кол-ва денег для конвертации);
let resultCurrencyFromAbb = document.querySelector('.currency_abb_from');
let resultCurrencyFromFull = document.querySelector('.currency_full_from');
let resultAmoutnFrom = document.querySelector('.currency_amount_from');

// получение блоков для вывода инфы о валюте на которую меняем (блоки для аббревиатуры валюты, полного названия, и для значения кол-ва денег после конвертации);
let resultCurrencyToAbb = document.querySelector('.currency_abb_to');
let resultCurrencyToFull = document.querySelector('.currency_full_to');
let resultAmoutnTo = document.querySelector('.currency_amount_to');


fetch(urlForCodes, {mode: 'cors'})
.then((response) => response.json())
.then((data) => {
    let dataCodes = data.supported_codes; // получение данных о кодах валют (['USD', 'United States Dollar'], ['UYU', 'Uruguayan Peso'])

    for (let i = 0; i < selects.length; i++) { // цикл для select-ов
        for (let key in dataCodes) { // в каждый select добаляем option-ы с кодами валют из  dataCodes
            let option = document.createElement('option');
            option.value = dataCodes[key][0];
            option.textContent = dataCodes[key][0];

            selects[i].append(option);
        }
    }

    sendRequestBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // при клике на кнопку, записываем значения из селектов в соответсвующие переменые
        [selectFrom, selectTo] = [selects[0].value, selects[1].value];
    
        // делаем запрос на преобразование пары валют 
        let urlPairConvert = `https://v6.exchangerate-api.com/v6/${key}/pair/${selectFrom}/${selectTo}`;

        fetch(urlPairConvert)
        .then((response) => response.json())
        .then((data) => {
            // делаем блок с результами оперции видимым
            resultBlock.style.opacity = '1';


            resultCurrencyFromAbb.textContent = selectFrom; // вывод кода валюты из которой провели конвертацию
            resultAmoutnFrom.textContent = Number(amount.value).toFixed(2); // вывод той суммы, которую ввели в инпут
            
            resultCurrencyToAbb.textContent = selectTo; // вывод кода валюты в которую перевели 
            resultAmoutnTo.textContent = Number(amount.value * data.conversion_rate).toFixed(2); // вывод суммы, после конвертации
            
            // сравниваем код валюты из селектов с массивом в котором все коды валют и их полные названия ([['USD', 'United States Dollar'], ['UYU', 'Uruguayan Peso']]), если коды равны, берем полное название, и выводм в блок
            for (let i = 0; i < dataCodes.length; i++) {
                if (selectFrom == dataCodes[i][0]) {
                    resultCurrencyFromFull.textContent = dataCodes[i][1];
                }

                if (selectTo == dataCodes[i][0]) {
                    resultCurrencyToFull.textContent = dataCodes[i][1];
                }
            }

            // получем символ валюты по ее коду ($14.00, KZT 10000) и выводим в блок
            let symbolCurrencyFrom = new Intl.NumberFormat("en", {style: "currency", currency: selectFrom}).format(1);
            let symbolCurrencyTo = new Intl.NumberFormat("en", {style: "currency", currency: selectTo}).format(data.conversion_rate);
            currencyRatioInfo.textContent = `${symbolCurrencyFrom} = ${symbolCurrencyTo}`;

        })
        

    })



  


 

    
    
})