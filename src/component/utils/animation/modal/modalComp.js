import React, { useState } from "react";
import { useTransition } from "react-spring";



import Modal from "./modal";

import "./styles.css";

export function ModalComp() {
  const [modalVisible, setModalVisible] = useState(false);
  const transitions = useTransition(modalVisible, null, {
    from: { opacity: 0, transform: "translateY(-40px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-40px)" }
  });

  return (
    <div className="modalComp">
      <button
        className="show-modal-button"
        onClick={() => setModalVisible(true)}
      >
        Show modal
      </button>
      {transitions.map(
        ({ item, key, props: style }) =>
          item && (
            <Modal
              style={style}
              closeModal={() => setModalVisible(false)}
              key={key}
            />
          )
      )}
    </div>
  );
}

