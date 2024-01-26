import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import './JogoAdivinhacao.css';
import Swal from 'sweetalert2';

const Input = styled.input`
  padding: 15px;
  font-size: 50px;
  width: 100px;
  margin: 20px;
  border: 9px solid ${(props) => props.isCorrect ? 'green' : props.isCorrectWrongPosition ? 'orange' : props.isWrong ? 'red' : 'initial'}  !important;
`

const JogoAdivinhacao = () => {
  const [numeros] = useState(Array.from({ length: 4 }, () => getRandomInt(0, 9)));
  const [tentativas, setTentativas] = useState(0);
  const [sugestoes, setSugestoes] = useState([]);
  const [inputValues, setInputValues] = useState(['', '', '', '']);
  const [feedbackText, setFeedbackText] = useState([]);
  const [finalMessage, setFinalMessage] = useState('');
  const [feedbackExecutado, setFeedbackExecutado] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('1234');
  const [currentInputIndex, setCurrentInputIndex] = useState(0);

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (inputValues.every((value) => value !== '')) {
      if (currentInputIndex === 3) {
        makeGuess();
        inputRefs[0].current.focus();
      } else {
        const nextIndex = currentInputIndex + 1;
        inputRefs[nextIndex].current.focus();
        setCurrentInputIndex(nextIndex);
      }
    }
  }, [inputValues, currentInputIndex]);

  useEffect(() => {
    if (feedbackExecutado) {
      setInputValues(['', '', '', '']);
      setFeedbackExecutado(false);
      setCurrentInputIndex(0);
      setPlaceholderText(inputValues.join(''));
    }
  }, [feedbackExecutado, inputValues]);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function makeGuess() {
    const userInput = inputValues.join('');
    if (!userInput || userInput.length !== 4 || isNaN(userInput)) {
      alert("Por favor, insira uma sequência de 4 números.");
      return;
    }

    const sugestao = inputValues.map((value) => parseInt(value, 10));
    const newSugestoes = [...sugestoes, sugestao];
    const feedbackText = feedback(sugestao);
    setFeedbackText([...feedbackText, feedbackText]);
    setSugestoes(newSugestoes);
    setTentativas(tentativas + 1);

    if (JSON.stringify(sugestao) === JSON.stringify(numeros)) {
      setFinalMessage(`Você acertou após ${tentativas + 1} tentativas!`);
      showCongratulationsModal();
    }

    setFeedbackExecutado(true);
  }

  function feedback(sugestao) {
    let feedbackText = [];
    for (let i = 0; i < 4; i++) {
      const valorNumeros = numeros[i];
      const valorSugestao = sugestao[i];

      if (valorNumeros === valorSugestao) {
        feedbackText.push({ text: `${valorSugestao} está certo`, className: 'text-success' });
      } else if (numeros.includes(valorSugestao)) {
        feedbackText.push({ text: `${valorSugestao} está certo, mas na posição errada`, className: 'text-warning' });
      } else {
        feedbackText.push({ text: `${valorSugestao} não faz parte`, className: 'text-danger' });
      }
    }
    return feedbackText;
  }

  const handleInputChange = (index) => (event) => {
    const { value } = event.target;
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);

    if (value) {
      setCurrentInputIndex(index);
    }
    if (index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const getInputClassName = (index) => {
    if (feedbackExecutado) {
      return feedbackText[index] ? feedbackText[index].className : '';
    }
    return '';
  };

  const showCongratulationsModal = () => {
    Swal.fire({
      title: 'Parabéns!',
      text: `Você acertou a sequência secreta após ${tentativas + 1} tentativas!`,
      icon: 'success',
      confirmButtonText: 'Fechar',
      animation: false, // Desabilita a animação do modal para compatibilidade com o SweetAlert2
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-6">
          <div className="text-center">
            <h1 className="mb-4">Adivinhe a sequência</h1>
            <p>Descubra a sequência secreta de 4 números</p>
          </div>
          <div className="d-flex justify-content-center">
            {inputValues.map((value, index) => (
              <Input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                className={`form-control text-center ${getInputClassName(index)}`}
                placeholder={placeholderText[index]}
                value={value}
                onChange={handleInputChange(index)}
                isCorrect={feedbackText[index] && feedbackText[index].className === 'text-success'}
                isCorrectWrongPosition={feedbackText[index] && feedbackText[index].className === 'text-warning'}
                isWrong={feedbackText[index] && feedbackText[index].className === 'text-danger'}
              />
            ))}
          </div>
          <ul className="list-group mt-3">
            {feedbackText.map((item, index) => (
              <li key={index} className={`list-group-item ${item.className}`}>
                {item.text}
              </li>
            ))}
          </ul>
          <ul className="list-group mt-3">
            {sugestoes.map((s, index) => (
              <li key={index} className="list-group-item bg-info text-center" style={{ fontSize: '30px' }}>
                {s.join('')}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {
        JSON.stringify(numeros)
      }
    </div>
  );
};

export default JogoAdivinhacao;
