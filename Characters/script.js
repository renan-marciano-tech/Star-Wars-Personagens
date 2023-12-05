let currentPageUrl = 'https://swapi.dev/api/people/'

window.onload = async () => {
    try {

        await loadCharacters(currentPageUrl);

    } catch (error) {

        console.log(error);
        alert('Erro ao carregar cards');

    }

    const proxBotao = document.getElementById('prox-botao');
    const antBotao = document.getElementById('anterior-botao');

    proxBotao.addEventListener('click', loadNextPage);
    antBotao.addEventListener('click', loadPreviousPage);

};

async function loadCharacters(url) { // Qnd chamada ela vai esperar receber dentro dela uma url(let current...)

    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Limpar os resultados anteriores. (string vazia)

    try {

        const response = await fetch(url); // vai armazenar o resultado dessa aquisição (const response)
        const responseJson = await response.json(); // transforma o resultado  em formato Json

        responseJson.results.forEach( (character) => { 
            //Colocamos 'results' por conta da API (os personagens estão dentro desse objeto)
            // o forEach irá iterar com todos objetos do array(looping), que será recebido ==> (charater)


            // Agora iremos criar os cards : 
            const card = document.createElement('div')
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')` // .url é por causa da api
            card.className = 'cards' // dando classe para div
            
            const characterNameBg = document.createElement('div')
            characterNameBg.className = 'character-name-bg'

            const characterName = document.createElement('span')
            characterName.className = 'character-name'
            characterName.innerHTML = `${character.name}` // cada card com seu nome de personagem

            characterNameBg.appendChild(characterName) // inserindo um elemento 'filho' dentro de characteraNameBg
            card.appendChild(characterNameBg)

            card.onclick = () => {
                const modal = document.getElementById('modal')
                modal.style.visibility = 'visible'

                const modalContent = document.getElementById('modal-content')
                modalContent.innerHTML = ''

                const characterImage = document.createElement('div')
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
                characterImage.className = 'character-image'

                
                const name = document.createElement('span')
                name.className = 'character-details'
                name.innerText = `Nome: ${character.name}`

                const characterHeight = document.createElement('span')
                characterHeight.className = 'character-details'
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

                const mass = document.createElement('span')
                mass.className = 'character-details'
                mass.innerText = `Peso: ${convertMass(character.mass)}`

                const eyecolor = document.createElement('span')
                eyecolor.className = 'character-details'
                eyecolor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}`

                const birthYear = document.createElement('span')
                birthYear.className = 'character-details'
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(mass)
                modalContent.appendChild(eyecolor)
                modalContent.appendChild(birthYear)
                
                
            }

            mainContent.appendChild(card)

        });

        const proxBotao = document.getElementById('prox-botao');
        const antBotao = document.getElementById('anterior-botao');

        proxBotao.disabled = !responseJson.next // esse next está dentro da api
        antBotao.disabled = !responseJson.previous // tbm na api (se houver pag anterior o botao estará habilitado)
        
        antBotao.style.visibility = responseJson.previous? "visible" : "hidden" // na resposta que vem da api, tem o previous? se sim, visivel. se não, hidden

        currentPageUrl =  url;

    } catch (error) {

        console.log(error);
        alert('Erro ao carregar os personagens');

    }
}

async function loadNextPage(){
    if(!currentPageUrl) return; // se o valor dessa variavel for nulo, dará um return (interromper a execução da função)

    try {

        const response = await fetch(currentPageUrl); // armazenou o resultado
        const responseJson = await response.json(); // tranformou em JSON

        await loadCharacters(responseJson.next);

    } catch (error) {

        console.log(error);
        alert('Erro ao carregar a próxima página');

    }
}

async function loadPreviousPage(){
    if(!currentPageUrl) return; // se o valor dessa variavel for nulo, dará um return (interromper a execução da função)

    try {

        const response = await fetch(currentPageUrl); // armazenou o resultado
        const responseJson = await response.json(); // tranformou em JSON

        await loadCharacters(responseJson.previous);

    } catch (error) {

        console.log(error);
        alert('Erro ao carregar a página anterior');

    }
}

function hidenModal(){
    const modal = document.getElementById('modal')
    modal.style.visibility = 'hidden'
}

// traduzindo as informações 

function convertEyeColor(eyeColor){ // bascicamente essa função recebe o dado da api, e la no return ela compara...
    const cores = {
        blue: 'azul',
        bluegray: 'azul claro', 
        brown: 'castanho',
        green: 'verde',
        yellow: 'amarelo',
        black: 'preto',
        pink: 'rosa',
        red: 'vermelho',
        orange: 'laranja',
        hazel: 'avela',
        unknown: 'desconhecido'
    };

    return cores [ eyeColor.toLowerCase() ] || eyeColor; // Se oo valor que está sendo recebido, está dentro do objeto 'cores', e irá atribuir o valor que está na devida chave (traduzir) ou retornar o original (caso n tenha a chave dentro de 'cores')
}

function convertHeight(height){
    if (height === 'unknown') {
        return 'desconhecida'
    } else {
        return (height / 100).toFixed(2)
    }
}

function convertMass(mass){
    if (mass === 'unknown') {
        return 'desconhecido'
    }else {
        return `${mass} Kg`
    }
}

function convertBirthYear(birthYear){
    if (birthYear === 'unknown') {
        return 'desconhecido'
    }else {
        return birthYear
    }
}