let dataStack = [];

const textbox = document.querySelector('input');
textbox.onkeyup = handleEvent;


function handleEvent(e) {
    if (e.code === 'Enter') {
        const text = textbox.value;
        textbox.value = '';

        try {
            execute(text, dataStack);
        } 
        catch (e) {
            if (e.name === errorTypes.PARSE) {
                put(`Parsing Error: ${e.message} - ${e.rawText}`)
            } else {
                put('Error: ' + e.message);
            }
            return;
        }

        put(dataStack.string());
    }
}

function put(text) {
    const output = document.getElementById('output');
    output.innerHTML += '> ' + text + '<br>';
    
    const prompt = document.getElementById('prompt');
    prompt.scrollTop = prompt.scrollHeight;
}
