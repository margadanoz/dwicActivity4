let sales = [
    {
      product: "Basketballs",
      units: 150
    },
    {
      product: "Baseballs",
      units: 125
    },
    {
      product: "Footballs",
      units: 300
    }
  ];
  
  let canvas = document.querySelector("#canvas");
  let context = canvas.getContext("2d");
  
  // Linea Vertical:
  context.beginPath();
  context.strokeStyle = "black";
  context.moveTo(30, 130);
  context.lineTo(30, 0);
  context.stroke();
  
  // Linea Horizontal:
  context.beginPath();
  context.strokeStyle = "black";
  context.moveTo(30, 130);
  context.lineTo(300, 130);
  context.stroke();
  
  dibuixaGraficEstandard();
  
  function dibuixaGraficEstandard() {
    dibuixarTitols();
    dibuixarVariantUnitats();
  }
  
  function dibuixarTitols() {
    // coger titulos que vienen del Json:
    let titolBasketballs = sales[0].product;
    let titolBaseballs = sales[1].product;
    let titolFootballs = sales[2].product;
  
    context.font = "10px Arial";
    context.fillStyle = "black";
    context.fillText("Products", 130, 150);
  
    context.font = "10px Arial";
    context.fillStyle = "black";
    context.fillText("Units", 0, 40);
  
    context.font = "10px Arial";
    context.fillStyle = "black";
    context.fillText(titolBasketballs, 40, 138);
  
    context.font = "10px Arial";
    context.fillStyle = "black";
    context.fillText(titolBaseballs, 120, 138);
  
    context.font = "10px Arial";
    context.fillStyle = "black";
    context.fillText(titolFootballs, 195, 138);
  }
  
  function dibuixarVariantUnitats() {
    // Ahafar unitats del Json:
    let unitatsBasketballs = sales[0].units;
    let unitatsBaseballs = sales[1].units;
    let unitatFootballs = sales[2].units;
  
    // Posició on es comançan a dibuixar els rectangles:
    let posicionInicioRect1 = 45;
    let posicionInicioRect2 = 120;
    let posicionInicioRect3 = 195;

    // amplada rectangles:
    let ampladaRect = 50;
  
    //Ajustar proporció dels rectangles divintlos per 2:
    let ajustaRect = 2; 

    // Prenem de referencia punt de creuament entre linea horizontal i vertical de dalt menys 1 perque sino trepitjen linea horizontal 
    // si el valor de creuament de la coordenada Y de totes dues es variés es variaria aqui baix el nombre per ajustarho
    let coordenadaY = 129;
  
    // Càlcul Basketball:
    // 4 paràmetres per dibuixar gradient dins el rectangle
    let orangeRectangle = context.createLinearGradient(posicionInicioRect1,coordenadaY - unitatsBasketballs / ajustaRect,posicionInicioRect1 + ampladaRect,coordenadaY);
    orangeRectangle.addColorStop(0.9, "orange");
    orangeRectangle.addColorStop(0, "white");
    context.fillStyle = orangeRectangle;
    // primer parámetre punt de partida on es diobuixará el rectangle
    // Restem per invertir direcció, sino es dibuixaría el rectangle trencatnt linea horizontal i escalem per proporcionar
    // amplada que ocupará cada rectangle, i darrer posicionament de proporció alçada
    context.fillRect(posicionInicioRect1,coordenadaY - unitatsBasketballs / ajustaRect,ampladaRect,unitatsBasketballs / ajustaRect);
    


    // Càlcul Baseball:
    let blueRectangle = context.createLinearGradient(posicionInicioRect2,coordenadaY - unitatsBaseballs / ajustaRect,posicionInicioRect2 + ampladaRect, coordenadaY);
    blueRectangle.addColorStop(0, "white");
    blueRectangle.addColorStop(0.1, "lightblue");
    context.fillStyle = blueRectangle;
    context.fillRect(posicionInicioRect2,coordenadaY - unitatsBaseballs / ajustaRect,ampladaRect,unitatsBaseballs / ajustaRect);
  
    // Càlcul Footballs:
    let redRectangle = context.createLinearGradient(posicionInicioRect3,coordenadaY - unitatFootballs / ajustaRect,posicionInicioRect3 + ampladaRect,coordenadaY);
    redRectangle.addColorStop(0, "white");
    redRectangle.addColorStop(0.7, "red");
    context.fillStyle = redRectangle;
    context.fillRect(posicionInicioRect3,coordenadaY - unitatFootballs / ajustaRect,ampladaRect,unitatFootballs / ajustaRect);
  }
  
