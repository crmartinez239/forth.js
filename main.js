const fvm = new Fvm();

const textbox = document.querySelector('input');
textbox.onkeyup = handleEvent;


function handleEvent(e) {
    if (e.code === 'Enter') {
        const text = textbox.value;
        textbox.value = '';
        //fvm.execute(text);
        try {
            fvm.execute(text);
        } 
        catch (e) {
            if (e.name === errorTypes.STACK || e.name === errorTypes.OPERATION) {
                put(`Error: ${e.message}`)
                return
            }

            if (e.name === errorTypes.PARSE) {
                put(`Parsing Error: ${e.message} - ${e.rawText}`);
                return
            }
            
            put(`JS Error: ${e.message}`);
            return;
        }

        put(`${text}&nbsp;&nbsp;${fvm.status}`);
    }
}

function put(text) {
    const output = document.getElementById('output');
    output.innerHTML += '-> ' + text + '<br>';
    
    const prompt = document.getElementById('prompt');
    prompt.scrollTop = prompt.scrollHeight;
}
