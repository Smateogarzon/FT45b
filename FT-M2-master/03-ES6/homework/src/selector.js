var traverseDomAndCollectElements = function (matchFunc, startEl) {
  var resultSet = [];

  if (typeof startEl === "undefined") {
    startEl = document.body;
  }

  // recorre el árbol del DOM y recolecta elementos que matchien en resultSet
  // usa matchFunc para identificar elementos que matchien

  // TU CÓDIGO AQUÍ
  let recorido = (elem) => {
    if (matchFunc(elem)) {
      resultSet.push(elem);
    }
    let hijos = elem.children;
    for (let i = 0; i < hijos.length; i++) {
      recorido(hijos[i]);
    }
  };
  recorido(startEl);
  return resultSet;
};

// Detecta y devuelve el tipo de selector
// devuelve uno de estos tipos: id, class, tag.class, tag

var selectorTypeMatcher = function (selector) {
  // tu código aquí
  if (selector.includes(">")) {
    return "childCombinator";
  } else if (selector.includes(" ")) {
    return "espacio";
  }
  const puntos = selector.split(".");
  return selector[0] === "#"
    ? "id"
    : selector[0] === "."
    ? "class"
    : puntos.length > 1
    ? "tag.class"
    : "tag";
};

// NOTA SOBRE LA FUNCIÓN MATCH
// recuerda, la función matchFunction devuelta toma un elemento como un
// parametro y devuelve true/false dependiendo si el elemento
// matchea el selector.

var matchFunctionMaker = function (selector) {
  var selectorType = selectorTypeMatcher(selector);
  var matchFunction;
  if (selectorType === "id") {
    matchFunction = (elem) => elem.id === selector.substring(1);
  } else if (selectorType === "class") {
    matchFunction = (elem) => elem.classList.contains(selector.substring(1));
  } else if (selectorType === "tag.class") {
    const separador = selector.split(".");
    const tag = separador[0];
    const clas = separador[1];
    matchFunction = (elem) => {
      return (
        elem.tagName.toLowerCase() === tag && elem.classList.contains(clas)
      );
    };
  } else if (selectorType === "tag") {
    matchFunction = (elem) => elem.tagName.toLowerCase() === selector;
  } else if (selectorType === "childCombinator") {
    const separador = selector.split(">");
    const padre = separador[0];
    const hijo = separador[1];
    matchFunction = (elem) => {
      let parent = elem.parentElement;
      return parent && parent.matches(padre) && elem.matches(hijo);}
      
    };
  } else if (selectorType === "espacio") {
    const separador = selector.split(" ");
    const padre = separador[0];
    const hijo = separador[1];
    matchFunction = (elem) => {
      return elem.closest(padre) && elem.matches(hijo);
    };
  } else {
    matchFunction = () => false;
  }
  return matchFunction;
};

var $ = function (selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
//#ets , .class , ll.sdf , tag , #id>p>a, id li
