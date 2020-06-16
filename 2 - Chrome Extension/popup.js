let AnimatorConfiguration = {
    type: 'nofilter',
    param: 0
};

let sepiaElement = document.getElementById('sepia');
let sepiaRangeElement = document.getElementById('sepia-range');
let sepiaTextElement = document.getElementById('sepia-text');
let saveBtnElement = document.getElementById('save-btn');

sepiaElement.addEventListener('focusin', () => {
    sepiaRangeElement.disabled = false;
});

sepiaElement.addEventListener('focusout', () => {
    sepiaRangeElement.disabled = true;
});

sepiaRangeElement.addEventListener('input', () => {
    sepiaTextElement.value = sepiaRangeElement.value;
});

saveBtnElement.addEventListener('click', () => {
    let inputType = document.getElementsByName('type');
    inputType.forEach(type => {
        if(type.checked && type.value === 'sepia') {
            AnimatorConfiguration.type = type.value;
            AnimatorConfiguration.param = parseInt(sepiaTextElement.value);
        }

        if(type.checked && type.value !== 'sepia') {
            AnimatorConfiguration.type = type.value;
            AnimatorConfiguration.param = 0;
        }
    })

    if(sepiaElement.checked) {
        sepiaRangeElement.disabled = false;
    } else {
        sepiaRangeElement.disabled = true;
    }
    console.log(AnimatorConfiguration);
});
