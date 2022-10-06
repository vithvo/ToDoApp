import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import List from "../List";
import Badge from "../Badge";

import "./AddButtonList.scss";
import closeSvg from "../../assets/img/close.svg";

const AddButtonList = ({ colors, onAdd }) => {
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [selectColor, setSelectColor] = useState(3);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(colors)) {
      setSelectColor(colors[0].id);
    }
  }, [colors]);

  const onClose = () => {
    setVisiblePopup(false);
    setInputValue("");
    setSelectColor(colors[0].id);
  };

  const addList = () => {
    if (!inputValue) {
      alert("Введите название списка");
      return;
    }
    setIsLoading(true);
    axios
      .post("http://localhost:3001/lists", {
        name: inputValue,
        colorId: selectColor,
      })
      .then(({ data }) => {
        const color = colors.filter((c) => c.id === selectColor)[0];
        const listObj = { ...data, color, tasks: [] };
        onAdd(listObj);
        onClose();
      })
      .catch(() => {
        alert("Ошибка при добавлении списка!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="add-list">
      <List
        click={() => {
          setVisiblePopup(true);
        }}
        items={[
          {
            className: "list__add-button",
            icon: (
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="#868686"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1V15"
                  stroke="#868686"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 8H15"
                  stroke="#868686"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            name: "Добавить список",
          },
        ]}
      />

      {visiblePopup && (
        <div className="add-list__popup">
          <img
            onClick={onClose}
            src={closeSvg}
            alt=""
            className="add-list__popup-close-btn"
          />

          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className="field"
            type="text"
            placeholder="Название списка"
          />

          <div className="add-list__popup-colors">
            {colors.map((color) => (
              <Badge
                onClick={() => setSelectColor(color.id)}
                key={color.id}
                color={color.name}
                className={selectColor === color.id && "active"}
              />
            ))}
          </div>
          <button onClick={addList} className="button">
            {isLoading ? "Добавление..." : "Добавить"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddButtonList;
