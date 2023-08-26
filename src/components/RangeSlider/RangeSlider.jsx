import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const RangeSlider = () => {
  const [type, setType] = useState('year'); // Тип слайдера: 'year' или 'month'
  const [change, setChange] = useState(true); // Состояние изменения
  const [marks2, setMarks2] = useState({});
  const [year1, setYear1] = useState("апр. 2015 г.")
  const [year2, setYear2] = useState("нояб. 2017 г.")

  // Создание пустых объектов для меток
  let marks = {};

  // Создание меток для диапазона лет 2014-2021
  for (let year = 2014; year <= 2021; year++) {
    for (let month = 0; month < 12; month++) {
      if (year === 2021 && month === 1) {
        break; // Пропуск января 2021
      }
      const monthIndex = (year - 2014) * 12 + month;
      let monthLabel;

      monthLabel = new Date(year, month).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });

      marks[monthIndex] = monthLabel;
    }
  }

  // Установка подсказок значений
  const setTooltips = () => {
    // Получение всех меток
    const markTextElements = document.querySelectorAll('.rc-slider-mark-text');
    let firstActiveValue = null;
    let lastActiveValue = null;

    // Поиск активных меток
    markTextElements.forEach(element => {
      if (element.classList.contains('rc-slider-mark-text-active')) {
        let value = '';

        value = element.getAttribute('text');

        if (firstActiveValue === null) {
          firstActiveValue = value;
        }
        lastActiveValue = value;
        if(type === 'year'){
          setYear1(firstActiveValue);
          setYear2(lastActiveValue);
        }
        if(type === 'month'){
          console.log(firstActiveValue);
        }
      }
    });

    // Обновление подсказок в зависимости от типа
    if (type === 'year') {
      document.querySelector('.tooltip-1').innerHTML = firstActiveValue;
      document.querySelector('.tooltip-2').innerHTML = lastActiveValue;
    }
    if (type === 'month') {
      document.querySelector('.tooltip-1').innerHTML = firstActiveValue;
      document.querySelector('.tooltip-2').innerHTML = lastActiveValue;
    }
  }

  // Создание подсказок
  const createTooltips = () => {
    const el1 = document.querySelector('.rc-slider-handle-1');
    const el2 = document.querySelector('.rc-slider-handle-2');

    if (!document.querySelector('.tooltip-1')) {
      const tooltip1 = document.createElement('div');
      tooltip1.classList.add('tooltip', 'tooltip-1');
      el1.append(tooltip1);
    }
    if (!document.querySelector('.tooltip-2')) {
      const tooltip2 = document.createElement('div');
      tooltip2.classList.add('tooltip', 'tooltip-2');
      el2.append(tooltip2);
    }
  }

  // Установка меток
  const setLabels = () => {
    if (type === 'year') {
      const labels = document.querySelectorAll('.rc-slider-mark-text');

      const months = ['фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

      labels.forEach(label => {
        const labelText = label.innerHTML;
        if (!label.getAttribute('text')) {
          label.setAttribute('text', labelText);
        }

        const includesMonth = months.some(month => labelText.includes(month));
        const firstMonth = label.innerHTML.includes("янв")

        if(firstMonth && label.getAttribute('text')){
          const nv = label.innerHTML.replace("янв.", "")
          const nv2 = nv.replace("г.", "")
          label.innerHTML = nv2
        }

        if (includesMonth) {
          label.style.display = 'none';
        }
      });
    }

    if (type === 'month') {
      const labels = document.querySelectorAll('.rc-slider-mark-text');

      labels.forEach(label => {
        const labelText = label.innerHTML;
        if (!label.getAttribute('text')) {
          label.setAttribute('text', labelText);
        }
        const year = labelText.split(' ')[1];
        const month = labelText.split(' ')[0];

        if (month === 'янв.') {
          label.classList.add('bold');
          label.innerHTML = year;
        } else {
          label.innerHTML = month;
          if (/^\d+$/.test(labelText)) { 
            label.classList.add('bold');
          }
        }
      });
    }
  }

  useEffect(() => {
    createTooltips();
    setTooltips();
    setLabels();
  }, [type, change]);


  useEffect(() => {
    const updatedMarks2 = {};

    const months = [
      "янв.", "февр.", "март", "апр.", "май", "июнь",
      "июль", "авг.", "сент.", "окт.", "нояб.", "дек."
    ];

    const parseYearMonth = (yearMonth) => {
      const parts = yearMonth.split(" ");
      const monthIndex = months.indexOf(parts[0]);
      const year = parseInt(parts[1]);
      return { year, monthIndex };
    };

    const startDateInfo = parseYearMonth(year1);
    const endDateInfo = parseYearMonth(year2);

    let monthIndex = 0;
    for (let currentYear = startDateInfo.year; currentYear <= endDateInfo.year; currentYear++) {
      const startMonth = (currentYear === startDateInfo.year) ? startDateInfo.monthIndex : 0;
      const endMonth = (currentYear === endDateInfo.year) ? endDateInfo.monthIndex : 11;

      for (let month = startMonth; month <= endMonth; month++) {
        updatedMarks2[monthIndex] = months[month] + " " + currentYear + " г.";
        monthIndex++;
      }
    }

    setMarks2(updatedMarks2);
    setTooltips();
    setLabels();
  }, [type, year1, year2]);

  return (
    <div className={`range ${type === 'year' ? 'year' : 'month' }`}>
      <div className='left'>
        <button className={type === 'year' ? 'active' : ''} onClick={() => {setType("year")}}>Все года</button>
        <button className={type === 'month' ? 'active' : ''} onClick={() => {setType("month")}}>Месяца</button>
      </div>
      {type === "year" && (
        <Slider
          range
          min={0}
          max={Object.keys(marks).length -= 1}
          step={null}
          marks={marks}
          defaultValue={[15, 46]}
          onChange={() => {setChange(!change)}}
        />
      )}
      {type === "month" && (
        <Slider
          range
          min={0}
          max={Object.keys(marks2).length -= 1}
          step={null}
          marks={marks2}
          defaultValue={[1, 3]}
          onChange={() => {setChange(!change)}}
        />
      )}
    </div>
  );
};

export default RangeSlider;