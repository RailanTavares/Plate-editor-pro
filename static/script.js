// ESTE É UM LOG CRÍTICO: Deve aparecer no console assim que o script for carregado.
console.log("script.js carregado e em execução.");

// --- DEFINIÇÃO DOS ESTADOS PADRÃO E TEMPLATES PRÉ-DEFINIDOS ---

const DEFAULT_STATE = {
    promocaoText: "OFERTA IMPERDÍVEL!",
    promocaoTextColor: "#E31837",
    promocaoStyle: "default",
    produtoName: "DESCRIÇÃO DO PRODUTO",
    productColor: "product-color-red",
    produtoFontFamily: "'Bebas Neue', sans-serif",
    produtoBold: false,
    produtoItalic: false,
    produtoUnderline: false,
    precoAntigo: "",
    precoAntigoSizeSlider: "45",
    precoAtualReal: "00",
    precoAtualCentavos: "00",
    cifraoSize: "80",
    precoPrincipalSize: "470",
    precoStyle: "manual",
    priceColor: "yellow",
    unidadeText: "KG",
    unidadeColor: "blue",
    unidadeStyle: "unidade-circulo", // Adicionado estado padrão para o estilo da unidade
    ofertaComboText: "",
    ofertaComboTextColor: "#E31837",
    ofertaComboBorderColor: "#FFBF00",
    validadeText: "",
    rodapeColor: "blue-footer"
};


const TEMPLATES = [
    {
        name: "Fim de Semana da Carne",
        data: {
            promocaoText: "FIM DE SEMANA DA CARNE",
            promocaoTextColor: "#FFFFFF",
            promocaoStyle: "fire",
            productColor: "product-color-red",
            priceColor: "yellow",
            precoStyle: "price-3d",
            unidadeText: "KG",
            unidadeColor: "red",
            unidadeStyle: "unidade-retangulo",
            rodapeColor: "red-footer"
        }
    },
    {
        name: "Hortifruti Fresquinho",
        data: {
            promocaoText: "HORTIFRUTI FRESQUINHO",
            promocaoTextColor: "#FFFFFF",
            promocaoStyle: "green-gradient",
            productColor: "product-color-green",
            priceColor: "black",
            precoStyle: "price-soft-shadow",
            unidadeText: "UN",
            unidadeColor: "green",
            unidadeStyle: "unidade-circulo",
            rodapeColor: "green-footer"
        }
    },
    {
        name: "Oferta Relâmpago",
        data: {
            promocaoText: "OFERTA RELÂMPAGO",
            promocaoTextColor: "#000000",
            promocaoStyle: "tech",
            productColor: "product-color-blue",
            priceColor: "red",
            precoStyle: "price-outlined",
            unidadeText: "UN",
            unidadeColor: "blue",
            unidadeStyle: "unidade-circulo",
            rodapeColor: "blue-footer"
        }
    },
    {
        name: "Queima de Estoque",
        data: {
            promocaoText: "QUEIMA DE ESTOQUE",
            promocaoTextColor: "#FFFFFF",
            promocaoStyle: "three-d",
            productColor: "product-color-black",
            priceColor: "yellow",
            precoStyle: "price-stroke",
            unidadeText: "UN",
            unidadeColor: "red",
            unidadeStyle: "unidade-retangulo",
            rodapeColor: "black-footer"
        }
    }
];

// --- FUNÇÃO CENTRAL PARA GARANTIR POSIÇÃO ABSOLUTA (COM CORREÇÃO DE VISIBILIDADE) ---
function ensureAbsolutePosition(element) {
    if (element.dataset.positionConverted || !element.offsetParent) {
        return;
    }

    const rect = element.getBoundingClientRect();
    const parentRect = element.offsetParent.getBoundingClientRect();

    element.style.left = (rect.left - parentRect.left) + 'px';
    element.style.top = (rect.top - parentRect.top) + 'px';
    element.style.transform = 'none';
    element.dataset.positionConverted = 'true';
}


// --- ATUALIZAÇÃO DRAG-AND-DROP COM BOUNDING BOX E VERIFICAÇÃO DE CAMADA BLOQUEADA ---
function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, isDragging = false;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        // Impede o arraste se a camada estiver bloqueada
        if (element.dataset.locked === 'true') {
            return;
        }

        if (e.target.classList.contains('resize-handle') || e.target.classList.contains('remove-image-btn')) return;

        e.preventDefault();
        isDragging = true;
        ensureAbsolutePosition(element);
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.classList.add('dragging');
        document.body.style.cursor = 'grabbing';
        document.onmousemove = elementDrag;
        document.onmouseup = closeDragElement;
    }

    function elementDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const parent = element.offsetParent;
        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        newX = Math.max(0, Math.min(newX, parentWidth - elementWidth));
        newY = Math.max(0, Math.min(newY, parentHeight - elementHeight));
        element.style.left = newX + 'px';
        element.style.top = newY + 'px';
    }

    function closeDragElement() {
        if (!isDragging) return;
        isDragging = false;
        element.classList.remove('dragging');
        document.body.style.cursor = 'default';
        document.onmouseup = null;
        document.onmousemove = null;
        recordHistory();
    }
}


// --- SELEÇÃO DE ELEMENTOS DO DOM (ATUALIZADA) ---

const welcomeContainer = document.getElementById('welcomeContainer');
const acessarEditorButton = document.getElementById('acessarEditorButton');
const openConfigModalButton = document.getElementById('openConfigModalButton');
const editorContainer = document.getElementById('editorContainer');
const placaA4 = document.getElementById('placaA4');
const templateSelector = document.getElementById('templateSelector');
const toggleTemplateSelector = document.getElementById('toggleTemplateSelector');
const templateSelectorContainer = document.getElementById('templateSelectorContainer');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const saveProjectButton = document.getElementById('saveProjectButton');
const importProjectInput = document.getElementById('importProjectInput');
const listaPlacas = document.getElementById('listaPlacas');
const adicionarLista = document.getElementById('adicionarLista');
const alterarLista = document.getElementById('alterarLista');
const removerLista = document.getElementById('removerLista');
const limparLista = document.getElementById('limparLista');
const exportarPdfLote = document.getElementById('exportarPdfLote');
const topMenuSalvar = document.getElementById('topMenuSalvar');
const topMenuCompartilhar = document.getElementById('topMenuCompartilhar');
const panelToggleButtons = document.querySelectorAll('.panel-toggle-button');
const controlPanels = document.querySelectorAll('.control-panel');
const promocaoText = document.getElementById('promocaoText');
const promocaoTextColor = document.getElementById('promocaoTextColor');
const promocaoStyle = document.getElementById('promocaoStyle');
const faixaPromocao = document.getElementById('faixaPromocao');
const produtoName = document.getElementById('produtoName');
const produtoDisplay = document.getElementById('produtoDisplay');
const productColorOptions = document.getElementById('productColorOptions');
// NOVOS ELEMENTOS PARA FORMATAÇÃO DO PRODUTO
const produtoFontFamily = document.getElementById('produtoFontFamily');
const produtoBold = document.getElementById('produtoBold');
const produtoItalic = document.getElementById('produtoItalic');
const produtoUnderline = document.getElementById('produtoUnderline');

const precoAntigoInput = document.getElementById('precoAntigo');
const precoAntigoDisplay = document.getElementById('precoAntigoDisplay');
const precoAntigoSizeSlider = document.getElementById('precoAntigoSizeSlider');
const precoAntigoSizeValue = document.getElementById('precoAntigoSizeValue');
const precoAtualReal = document.getElementById('precoAtualReal');
const precoAtualCentavos = document.getElementById('precoAtualCentavos');
const cifraoSizeInput = document.getElementById('cifraoSize');
const cifraoDisplay = document.getElementById('cifraoDisplay');
const precoPrincipalSizeInput = document.getElementById('precoPrincipalSize');
const precoPrincipalSizeSlider = document.getElementById('precoPrincipalSizeSlider');
const precoStyle = document.getElementById('precoStyle');
const precoAtualDisplay = document.getElementById('precoAtualDisplay');
const priceColorOptions = document.getElementById('priceColorOptions');
const unidadeText = document.getElementById('unidadeText');
const unidadeColor = document.getElementById('unidadeColor');
const unidadeStyle = document.getElementById('unidadeStyle'); // Elemento adicionado
const unidadeDisplay = document.getElementById('unidadeDisplay');
const ofertaComboText = document.getElementById('ofertaComboText');
const ofertaComboDisplay = document.getElementById('ofertaComboDisplay');
const ofertaComboTextColor = document.getElementById('ofertaComboTextColor');
const ofertaComboBorderColor = document.getElementById('ofertaComboBorderColor');
const validadeText = document.getElementById('validadeText');
const validadeDisplay = document.getElementById('validadeDisplay');
const rodapeColor = document.getElementById('rodapeColor');
const rodape = document.getElementById('rodape');
const telefoneDisplay = document.getElementById('telefoneDisplay');
const enderecoDisplay = document.getElementById('enderecoDisplay');
const instagramDisplay = document.getElementById('instagramDisplay');
const allControlInputs = document.querySelectorAll('.controls input, .controls select:not(#listaPlacas)');
const logoutButton = document.getElementById('logoutButton');
const messageBox = document.getElementById('messageBox');
const messageBoxTitle = document.getElementById('messageBoxTitle');
const messageBoxMessage = document.getElementById('messageBoxMessage');
const messageBoxClose = document.getElementById('messageBoxClose');
const socialShareModal = document.getElementById('socialShareModal');
const socialShareClose = document.getElementById('socialShareClose');
const configModal = document.getElementById('configModal');
const configModalClose = document.getElementById('configModalClose');
const modalTelefoneText = document.getElementById('modalTelefoneText');
const modalEnderecoText = document.getElementById('modalEnderecoText');
const modalInstagramText = document.getElementById('modalInstagramText');
const saveContactInfoButton = document.getElementById('saveContactInfoButton');
const configMessage = document.getElementById('configMessage');
const saveModal = document.getElementById('saveModal');
const saveModalClose = document.getElementById('saveModalClose');
const savePngButton = document.getElementById('savePngButton');
const savePdfButton = document.getElementById('savePdfButton');
const imageUpload = document.getElementById('imageUpload');
const logoUpload = document.getElementById('logoUpload');
const logoPreview = document.getElementById('logoPreview');
const saveLogoButton = document.getElementById('saveLogoButton');
const removeLogoButton = document.getElementById('removeLogoButton');

// CONSTANTES PARA O MODAL DE CONFIRMAÇÃO
const confirmationModal = document.getElementById('confirmationModal');
const confirmationModalTitle = document.getElementById('confirmationModalTitle');
const confirmationModalMessage = document.getElementById('confirmationModalMessage');
const confirmYesButton = document.getElementById('confirmYesButton');
const confirmNoButton = document.getElementById('confirmNoButton');

// --- CONSTANTES PARA TEXTO LIVRE ---
const addFreeTextButton = document.getElementById('addFreeTextButton');
const freeTextControls = document.getElementById('freeTextControls');
const freeTextContent = document.getElementById('freeTextContent');
const freeTextColor = document.getElementById('freeTextColor');
const freeTextSizeSlider = document.getElementById('freeTextSizeSlider');
const freeTextSizeValue = document.getElementById('freeTextSizeValue');
const removeFreeTextButton = document.getElementById('removeFreeTextButton');
const freeTextFontFamily = document.getElementById('freeTextFontFamily');
const freeTextBold = document.getElementById('freeTextBold');
const freeTextItalic = document.getElementById('freeTextItalic');
const freeTextUnderline = document.getElementById('freeTextUnderline');
const freeTextAlignLeft = document.getElementById('freeTextAlignLeft');
const freeTextAlignCenter = document.getElementById('freeTextAlignCenter');
const freeTextAlignRight = document.getElementById('freeTextAlignRight');

// --- CONSTANTES PARA SÍMBOLOS ---
const symbolControls = document.getElementById('symbolControls');
const symbolColor = document.getElementById('symbolColor');
const symbolSizeSlider = document.getElementById('symbolSizeSlider');
const symbolSizeValue = document.getElementById('symbolSizeValue');
const removeSymbolButton = document.getElementById('removeSymbolButton');

// --- CONSTANTES PARA PAINEL DE CAMADAS ---
const layersPanel = document.getElementById('layersPanel');
const layerList = document.getElementById('layerList');

// --- NOVO: CONSTANTES PARA A PRÉ-VISUALIZAÇÃO ---
const previewButton = document.getElementById('previewButton');
const previewOverlay = document.getElementById('previewOverlay');
const previewContent = document.getElementById('previewContent');
const closePreview = document.getElementById('closePreview');
const previewChoiceModal = document.getElementById('previewChoiceModal');
const previewChoiceModalClose = document.getElementById('previewChoiceModalClose');
const previewCurrentButton = document.getElementById('previewCurrentButton');
const previewListButton = document.getElementById('previewListButton');
const previewNavigationControls = document.getElementById('previewNavigationControls');
const previewPrevButton = document.getElementById('previewPrevButton');
const previewNextButton = document.getElementById('previewNextButton');
const previewCounter = document.getElementById('previewCounter');


// --- LÓGICA DE CALLBACK PARA MODAL DE CONFIRMAÇÃO ---
let confirmCallback = null;
let cancelCallback = null;

const { jsPDF } = window.jspdf;
let productImageCounter = 0;

// --- VARIÁVEIS PARA CONTROLE DE TEXTO E SÍMBOLOS ---
let freeTextCounter = 0;
let selectedTextElement = null;
let currentlyEditingIndex = -1;

// --- LÓGICA DE ARRASTAR E SOLTAR PARA O PAINEL DE CAMADAS ---
let draggedLayer = null;

function initializeLayerDragAndDrop() {
    layerList.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('layer-item')) {
            draggedLayer = e.target;
            setTimeout(() => {
                e.target.classList.add('dragging-layer');
            }, 0);
        }
    });

    layerList.addEventListener('dragend', (e) => {
        if (draggedLayer) {
            draggedLayer.classList.remove('dragging-layer');
            draggedLayer = null;
            applyZIndexFromPanel();
            recordHistory();
        }
    });

    layerList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(layerList, e.clientY);
        if (afterElement == null) {
            layerList.appendChild(draggedLayer);
        } else {
            layerList.insertBefore(draggedLayer, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.layer-item:not(.dragging-layer)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


function makeDraggableAndResizable(element) {
    let offsetX, offsetY, isDragging = false;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (element.dataset.locked === 'true') return;
        if (e.target.classList.contains('resize-handle') || e.target.classList.contains('remove-image-btn')) return;
        e.preventDefault();
        isDragging = true;

        ensureAbsolutePosition(element);

        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        document.onmousemove = elementDrag;
        document.onmouseup = closeDragElement;
    }

    function elementDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const parent = element.offsetParent;
        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        newX = Math.max(0, Math.min(newX, parentWidth - elementWidth));
        newY = Math.max(0, Math.min(newY, parentHeight - elementHeight));

        element.style.left = newX + 'px';
        element.style.top = newY + 'px';
    }

    function closeDragElement() {
        if (!isDragging) return;
        isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;

        if (element.id === 'companyLogoContainer') {
            saveLogoPosition(element.style.left, element.style.top, element.style.width, element.style.height);
        }

        recordHistory();
    }

    const resizeHandle = element.querySelector('.resize-handle');
    let originalWidth, originalHeight, originalMouseX, originalMouseY;

    if (resizeHandle) {
        resizeHandle.onmousedown = function(e) {
            if (element.dataset.locked === 'true') return;
            e.preventDefault();
            e.stopPropagation();
            originalWidth = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
            originalHeight = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            originalMouseX = e.pageX;
            originalMouseY = e.pageY;
            window.addEventListener('mousemove', resizeElement);
            window.addEventListener('mouseup', stopResize);
        };
    }

    function resizeElement(e) {
        const parent = element.offsetParent;
        const parentWidth = parent.offsetWidth;
        const currentLeft = element.offsetLeft;
        let newWidth = originalWidth + (e.pageX - originalMouseX);

        if (currentLeft + newWidth > parentWidth) {
            newWidth = parentWidth - currentLeft;
        }

        const newHeight = (newWidth / originalWidth) * originalHeight;
        if (newWidth > 30) {
            element.style.width = newWidth + 'px';
            element.style.height = newHeight + 'px';
        }
    }

    function stopResize() {
        window.removeEventListener('mousemove', resizeElement);
        window.removeEventListener('mouseup', stopResize);

        if (element.id === 'companyLogoContainer') {
            saveLogoPosition(element.style.left, element.style.top, element.style.width, element.style.height);
        }

        recordHistory();
    }
}


// --- LÓGICA DE UNDO/REDO E ESTADO (ATUALIZADA PARA CAMADAS) ---
let historyStack = [];
let redoStack = [];

function saveState() {
    document.querySelectorAll('#placaA4 .draggable').forEach(ensureAbsolutePosition);

    const state = {
        inputs: {},
        elements: {},
        productImages: [],
        freeTexts: [],
        layers: [] // NOVO: para salvar o estado das camadas
    };

    allControlInputs.forEach(input => {
        if (input.type !== 'file') {
            state.inputs[input.id] = input.value;
        }
    });

    // Salva botões de formatação do produto
    state.inputs.produtoFontFamily = produtoFontFamily.value;
    state.inputs.produtoBold = produtoBold.classList.contains('active');
    state.inputs.produtoItalic = produtoItalic.classList.contains('active');
    state.inputs.produtoUnderline = produtoUnderline.classList.contains('active');
    
    state.inputs['productColorOptions'] = productColorOptions.querySelector('.color-option.selected').dataset.colorClass;
    state.inputs['priceColorOptions'] = priceColorOptions.querySelector('.color-option.selected').dataset.colorClass;

    document.querySelectorAll('#placaA4 .draggable:not(.product-image-container):not(.texto-livre-item)').forEach(elem => {
        const elemState = {
            left: elem.style.left,
            top: elem.style.top,
            width: elem.style.width,
            height: elem.style.height,
            fontSize: elem.style.fontSize
        };
        if (elem.id === 'companyLogoContainer') {
            const img = elem.querySelector('img');
            if (img) elemState.src = img.src;
        }
        state.elements[elem.id] = elemState;
    });

    document.querySelectorAll('.product-image-container').forEach(imgContainer => {
        const img = imgContainer.querySelector('img');
        if (img) {
            state.productImages.push({
                id: imgContainer.id,
                src: img.src,
                left: imgContainer.style.left,
                top: imgContainer.style.top,
                width: imgContainer.style.width,
                height: imgContainer.style.height,
            });
        }
    });

    document.querySelectorAll('.texto-livre-item').forEach(textElem => {
        state.freeTexts.push({
            id: textElem.id,
            type: textElem.dataset.type, // Salva o tipo (text ou symbol)
            content: textElem.textContent,
            color: textElem.style.color,
            fontSize: textElem.style.fontSize,
            fontFamily: textElem.style.fontFamily,
            fontWeight: textElem.style.fontWeight,
            fontStyle: textElem.style.fontStyle,
            textDecoration: textElem.style.textDecoration,
            textAlign: textElem.style.textAlign,
            left: textElem.style.left,
            top: textElem.style.top,
        });
    });

    // Salva o estado das camadas (ordem, visibilidade, bloqueio)
    layerList.querySelectorAll('.layer-item').forEach(layerItem => {
        const targetId = layerItem.dataset.targetId;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            state.layers.push({
                id: targetId,
                visible: !layerItem.querySelector('.fa-eye-slash'),
                locked: targetElement.dataset.locked === 'true'
            });
        }
    });

    return state;
}

function restoreState(state) {
    if (!state) return;

    document.querySelectorAll('.product-image-container, .texto-livre-item').forEach(el => el.remove());
    const existingLogo = document.getElementById('companyLogoContainer');
    if (existingLogo) existingLogo.remove();
    productImageCounter = 0;
    freeTextCounter = 0;
    deselectAllLayers();

    if (state.inputs) {
        Object.keys(state.inputs).forEach(id => {
            const element = document.getElementById(id);
            if (element && element.type !== 'file') {
                if (id === 'productColorOptions' || id === 'priceColorOptions') {
                    const colorClass = state.inputs[id];
                    const container = document.getElementById(id);
                    container.querySelector('.color-option.selected')?.classList.remove('selected');
                    const optionToSelect = container.querySelector(`.color-option[data-color-class="${colorClass}"]`);
                    if (optionToSelect) optionToSelect.classList.add('selected');
                } else if (id.startsWith('produto') && typeof state.inputs[id] === 'boolean') {
                    // Restaura botões de formatação do produto
                    element.classList.toggle('active', state.inputs[id]);
                }
                else {
                    element.value = state.inputs[id];
                    if (element.type === 'range') {
                        const event = new Event('input');
                        element.dispatchEvent(event);
                    }
                }
            }
        });
    }

    setTimeout(() => {
        if (state.elements) {
            Object.keys(state.elements).forEach(id => {
                const props = state.elements[id];
                if (!props) return;

                let element = document.getElementById(id);
                if (id === 'companyLogoContainer' && props.src) {
                     createImageOnPlaca(props.src, 'companyLogoContainer', {
                        left: props.left, top: props.top, width: props.width, height: props.height
                    }, false, "Logo da Empresa");
                } else if (element) {
                    element.style.left = props.left || '';
                    element.style.top = props.top || '';
                    element.style.width = props.width || '';
                    element.style.height = props.height || '';
                    element.style.fontSize = props.fontSize || '';
                    element.style.transform = 'none';
                    element.dataset.positionConverted = 'true';
                }
            });
        }

        if (state.productImages) {
            state.productImages.forEach((imgData, index) => {
                const styles = { left: imgData.left, top: imgData.top, width: imgData.width, height: imgData.height };
                createImageOnPlaca(imgData.src, imgData.id, styles, true, `Imagem ${index + 1}`);

                const idNum = parseInt(imgData.id.split('_')[1]);
                if (idNum >= productImageCounter) {
                    productImageCounter = idNum + 1;
                }
            });
        }

        if (state.freeTexts) {
            state.freeTexts.forEach(textData => {
                const name = textData.type === 'symbol' ? 'Símbolo' : `Texto Livre`;
                createFreeTextElement(textData, name);
                const idNum = parseInt(textData.id.split('_')[1]);
                 if (idNum >= freeTextCounter) {
                    freeTextCounter = idNum + 1;
                }
            });
        }
        
        initializePlaca();

        // Restaura o estado das camadas
        if (state.layers && state.layers.length > 0) {
            // Primeiro, reconstrói o painel na ordem correta
            updateLayersPanel(state.layers.map(l => l.id));
            
            // Depois, aplica visibilidade e bloqueio
            state.layers.forEach(layerState => {
                const element = document.getElementById(layerState.id);
                if (element) {
                    const isCurrentlyVisible = element.style.display !== 'none';
                    if (isCurrentlyVisible !== layerState.visible) {
                        toggleLayerVisibility(element);
                    }
                    
                    const isCurrentlyLocked = element.dataset.locked === 'true';
                     if (isCurrentlyLocked !== layerState.locked) {
                        toggleLayerLock(element);
                    }
                }
            });
        } else {
            // Se não houver estado de camada, constrói com a ordem padrão
            updateLayersPanel();
        }

    }, 0);
}


function recordHistory() {
    redoStack = [];
    historyStack.push(saveState());
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    undoButton.disabled = historyStack.length <= 1;
    redoButton.disabled = redoStack.length === 0;
}

function undo() {
    if (historyStack.length > 1) {
        redoStack.push(historyStack.pop());
        const previousState = historyStack[historyStack.length - 1];
        restoreState(previousState);
        updateUndoRedoButtons();
    }
}

function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        historyStack.push(nextState);
        restoreState(nextState);
        updateUndoRedoButtons();
    }
}

function updatePromocao() {
    faixaPromocao.textContent = promocaoText.value || 'OFERTA';
    faixaPromocao.className = `faixa-promocao ${promocaoStyle.value}`;
    faixaPromocao.style.color = promocaoTextColor.value;
}

function updateProduto() {
    let productName = produtoName.value.toUpperCase();
    if (productName.length > 25) {
        produtoDisplay.style.fontSize = '60px';
    } else if (productName.length > 15) {
        produtoDisplay.style.fontSize = '75px';
    } else {
        produtoDisplay.style.fontSize = '90px';
    }
    produtoDisplay.textContent = productName || 'PRODUTO';
    
    // Aplica cor
    const selectedOption = productColorOptions.querySelector('.color-option.selected');
    if (selectedOption) {
        const colorClass = selectedOption.dataset.colorClass;
        // Limpa classes de cor antigas antes de adicionar a nova
        produtoDisplay.className = produtoDisplay.className.replace(/product-color-\w+/g, '');
        produtoDisplay.classList.add('produto', 'draggable', 'interactive-placa-element', colorClass);
    }

    // Aplica fonte e estilo
    produtoDisplay.style.fontFamily = produtoFontFamily.value;
    produtoDisplay.style.fontWeight = produtoBold.classList.contains('active') ? '900' : '400';
    produtoDisplay.style.fontStyle = produtoItalic.classList.contains('active') ? 'italic' : 'normal';

    let textDecoration = precoAntigoDisplay.style.textDecoration.includes('line-through') ? 'line-through' : '';
    if (produtoUnderline.classList.contains('active')) {
        textDecoration += ' underline';
    }
    produtoDisplay.style.textDecoration = textDecoration.trim();
}


function updatePrecoAntigo() {
    const preco = parseFloat(precoAntigoInput.value);
    const shouldBeVisible = !isNaN(preco) && preco > 0;

    precoAntigoDisplay.style.display = shouldBeVisible ? 'block' : 'none';
    
    if (shouldBeVisible) {
        precoAntigoDisplay.textContent = `DE R$ ${preco.toFixed(2).replace('.', ',')}`;
        const size = precoAntigoSizeSlider.value;
        precoAntigoDisplay.style.fontSize = `${size}px`;
        precoAntigoSizeValue.textContent = `${size}px`;
    }
    updateLayersPanel();
}

function updatePrecoAtual() {
    const real = parseInt(precoAtualReal.value);
    let centavos = parseInt(precoAtualCentavos.value);
    centavos = isNaN(centavos) ? '00' : String(centavos).padStart(2, '0');

    if (!isNaN(real)) {
        const fullPrice = `${real}`;
        const precoElement = precoAtualDisplay;
        const selectedColorOption = priceColorOptions.querySelector('.color-option.selected');
        const colorClass = selectedColorOption ? selectedColorOption.dataset.colorClass : 'yellow';
        const styleClass = precoStyle.value;
        precoElement.className = `preco ${colorClass} ${styleClass}`;

        const manualSize = precoPrincipalSizeInput.value;
        precoElement.style.fontSize = `${manualSize}px`;

        precoElement.innerHTML = `${fullPrice}<span class="centavos-separator">,</span><span class="fracao">${centavos}</span>`;
    } else {
        precoAtualDisplay.innerHTML = '0<span class="centavos-separator">,</span><span class="fracao">00</span>';
    }
    const cifraoSize = cifraoSizeInput.value;
    if (cifraoSize && !isNaN(cifraoSize)) {
        cifraoDisplay.style.fontSize = `${cifraoSize}px`;
    } else {
        cifraoDisplay.style.fontSize = '';
    }
}

function updateUnidade() {
    unidadeDisplay.textContent = unidadeText.value.toUpperCase() || 'UN';
    unidadeDisplay.className = `unidade ${unidadeColor.value} ${unidadeStyle.value}`;
}


function updateOfertaCombo() {
    const hasText = ofertaComboText.value.trim() !== '';
    ofertaComboDisplay.style.display = hasText ? 'block' : 'none';

    if (hasText) {
        ofertaComboDisplay.textContent = ofertaComboText.value.toUpperCase();
        ofertaComboDisplay.style.color = ofertaComboTextColor.value;
        ofertaComboDisplay.style.borderColor = ofertaComboBorderColor.value;
    }
    updateLayersPanel();
}

function updateValidade() {
    const hasText = validadeText.value.trim() !== '';
    validadeDisplay.style.display = hasText ? 'block' : 'none';
    
    if (hasText) {
        validadeDisplay.textContent = validadeText.value.toUpperCase();
    }
    updateLayersPanel();
}

function updateRodape() {
    rodape.className = `rodape ${rodapeColor.value}`;
}

async function loadContactInfo(populateModal = false) {
    try {
        const response = await fetch('/get_contact_info');
        const data = await response.json();

        telefoneDisplay.innerHTML = `<i class="fas fa-phone-alt"></i> ${data.telefone || ''}`;
        enderecoDisplay.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.endereco || ''}`;
        instagramDisplay.innerHTML = `<i class="fab fa-instagram"></i> ${data.instagram || ''}`;

        if (populateModal) {
            modalTelefoneText.value = data.telefone || '';
            modalEnderecoText.value = data.endereco || '';
            modalInstagramText.value = data.instagram || '';
        }
        updateRodape();
    } catch (error) {
        console.error('Erro ao carregar informações de contato:', error);
        telefoneDisplay.innerHTML = `<i class="fas fa-phone-alt"></i> (89) 98803-0512`;
        enderecoDisplay.innerHTML = `<i class="fas fa-map-marker-alt"></i> Rua Desembargador Amaral, 2037 - Centro`;
        instagramDisplay.innerHTML = `<i class="fab fa-instagram"></i> @fonsecasupermercado.corrente`;
        if (populateModal) {
            modalTelefoneText.value = '(89) 98803-0512';
            modalEnderecoText.value = 'Rua Desembargador Amaral, 2037 - Centro';
            modalInstagramText.value = '@fonsecasupermercado.corrente';
        }
        updateRodape();
    }
}

function initializePlaca() {
    updatePromocao();
    updateProduto();
    updatePrecoAntigo();
    updatePrecoAtual();
    updateUnidade();
    updateOfertaCombo();
    updateValidade();
    loadContactInfo();
    updateLayersPanel();
}

function showMessageBox(title, message) {
    messageBoxTitle.textContent = title;
    messageBoxMessage.textContent = message;
    messageBox.classList.add('show');
}

function hideMessageBox() {
    messageBox.classList.remove('show');
}

function showConfirmationModal(title, message, confirmText, cancelText, onConfirm, onCancel) {
    confirmationModalTitle.textContent = title;
    confirmationModalMessage.textContent = message;
    confirmYesButton.textContent = confirmText;
    confirmNoButton.textContent = cancelText;

    confirmCallback = onConfirm;
    cancelCallback = onCancel;

    confirmationModal.classList.add('show');
}

function hideConfirmationModal() {
    confirmationModal.classList.remove('show');
}

function showSaveModal() {
    saveModal.classList.add('show');
}

function hideSaveModal() {
    saveModal.classList.remove('show');
}

function showSocialShareModal() {
    socialShareModal.classList.add('show');
}

function hideSocialShareModal() {
    socialShareModal.classList.remove('show');
}

function showConfigModal() {
    const savedLogo = JSON.parse(localStorage.getItem('companyLogo'));
    if (savedLogo && savedLogo.src) {
        logoPreview.src = savedLogo.src;
        logoPreview.style.display = 'block';
    } else {
        logoPreview.style.display = 'none';
    }
    configModal.classList.add('show');
    configMessage.style.display = 'none';
    loadContactInfo(true);
}

function hideConfigModal() {
    configModal.classList.remove('show');
}

// --- Funções para a Pré-visualização (ATUALIZADAS) ---

let previewListStates = [];
let currentPreviewIndex = 0;
let editorStateBeforePreview = null;

// 1. Mostra o modal de escolha
function showPreviewChoiceModal() {
    previewChoiceModal.classList.add('show');
}

function hidePreviewChoiceModal() {
    previewChoiceModal.classList.remove('show');
}

// 2. Mostra a pré-visualização da edição ATUAL
function showCurrentEditPreview() {
    hidePreviewChoiceModal();
    // Deseleciona qualquer camada para remover as bordas
    deselectAllLayers();
    
    // Limpa o conteúdo anterior
    previewContent.innerHTML = '';

    // Esconde os controles de navegação
    previewNavigationControls.style.display = 'none';

    // Clona a placa
    const placaClone = placaA4.cloneNode(true);

    // Remove classes e elementos indesejados no clone
    placaClone.querySelectorAll('.interactive-placa-element').forEach(el => {
        el.classList.remove('interactive-placa-element', 'selected-layer');
    });
    placaClone.querySelectorAll('.resize-handle, .remove-image-btn').forEach(el => el.remove());

    // Anexa o clone ao contêiner de pré-visualização
    previewContent.appendChild(placaClone);
    
    // Ajusta o tamanho do clone para caber na tela
    setTimeout(() => {
        const viewportW = window.innerWidth * 0.9;
        const viewportH = window.innerHeight * 0.9;
        const scale = Math.min(viewportW / placaClone.offsetWidth, viewportH / placaClone.offsetHeight);
        placaClone.style.transform = `scale(${scale})`;
    }, 10);

    // Mostra o overlay principal
    previewOverlay.classList.add('show');
}

// 3. Inicia a pré-visualização da LISTA
function startListPreview() {
    hidePreviewChoiceModal();

    if (listaPlacas.options.length === 0) {
        showMessageBox('Lista Vazia', 'Não há produtos na lista para visualizar.');
        return;
    }

    // Salva o estado atual do editor para restaurar depois
    editorStateBeforePreview = saveState();

    // Coleta todos os estados da lista de placas
    previewListStates = Array.from(listaPlacas.options).map(option => JSON.parse(option.dataset.placaData));
    
    currentPreviewIndex = 0;
    
    // Mostra os controles de navegação
    previewNavigationControls.style.display = 'flex';
    
    // Exibe o primeiro item da lista
    displayListPreviewAtIndex(currentPreviewIndex);

    // Mostra o overlay principal
    previewOverlay.classList.add('show');
}

// 4. Exibe uma placa específica da lista na pré-visualização
async function displayListPreviewAtIndex(index) {
    if (index < 0 || index >= previewListStates.length) {
        return; // Índice fora dos limites
    }

    // Deseleciona qualquer camada no editor principal para evitar bordas
    deselectAllLayers();

    const stateToDisplay = previewListStates[index];
    
    // Restaura o estado da placa da lista no editor principal (temporariamente)
    restoreState(stateToDisplay);
    
    // Aguarda um momento para que o DOM seja completamente atualizado com o novo estado
    await new Promise(resolve => setTimeout(resolve, 100));

    previewContent.innerHTML = '';
    const placaClone = placaA4.cloneNode(true);

    // Limpa o clone de elementos de UI
    placaClone.querySelectorAll('.interactive-placa-element').forEach(el => {
        el.classList.remove('interactive-placa-element', 'selected-layer');
    });
    placaClone.querySelectorAll('.resize-handle, .remove-image-btn').forEach(el => el.remove());

    previewContent.appendChild(placaClone);

    // Redimensiona o clone para caber na tela
    setTimeout(() => {
        const viewportW = window.innerWidth * 0.9;
        const viewportH = window.innerHeight * 0.9;
        const scale = Math.min(viewportW / placaClone.offsetWidth, viewportH / placaClone.offsetHeight);
        placaClone.style.transform = `scale(${scale})`;
    }, 10);

    // Atualiza o contador
    previewCounter.textContent = `${index + 1} / ${previewListStates.length}`;
}

// 5. Função para fechar a pré-visualização e restaurar o estado
function hidePreview() {
    previewOverlay.classList.remove('show');
    previewContent.innerHTML = ''; // Limpa para liberar memória

    // Se estávamos vendo a lista, restaura o estado original do editor
    if (editorStateBeforePreview) {
        restoreState(editorStateBeforePreview);
        editorStateBeforePreview = null; // Limpa o estado salvo
    }
}


function addFreeText() {
    const id = `freeText_${freeTextCounter++}`;
    const textData = {
        id: id,
        type: 'text',
        content: 'NOVO TEXTO',
        color: '#000000',
        fontSize: '50px',
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center',
        left: '100px',
        top: '700px'
    };
    const textElement = createFreeTextElement(textData, `Texto Livre ${freeTextCounter}`);
    updateLayersPanel();
    selectLayer(textElement);
    recordHistory();
}

function insertSymbolAsFreeText(symbol) {
    const id = `freeText_${freeTextCounter++}`;
    const textData = {
        id: id,
        type: 'symbol',
        content: symbol,
        color: '#000000',
        fontSize: '100px',
        fontFamily: "'Arial', sans-serif",
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center',
        left: '150px',
        top: '400px'
    };
    const textElement = createFreeTextElement(textData, `Símbolo ${freeTextCounter}`);
    updateLayersPanel();
    selectLayer(textElement);
    recordHistory();
}

function createFreeTextElement(data, name) {
    const textDiv = document.createElement('div');
    textDiv.id = data.id;
    textDiv.className = 'texto-livre-item draggable interactive-placa-element';

    textDiv.dataset.targetPanel = data.type === 'symbol' ? 'panelSimbolos' : 'panelTextoLivre';
    textDiv.dataset.type = data.type;
    textDiv.dataset.name = name; // Nome para o painel de camadas

    textDiv.textContent = data.content;
    textDiv.style.color = data.color;
    textDiv.style.fontSize = data.fontSize;
    textDiv.style.fontFamily = data.fontFamily || "'Roboto', sans-serif";
    textDiv.style.fontWeight = data.fontWeight || 'normal';
    textDiv.style.fontStyle = data.fontStyle || 'normal';
    textDiv.style.textDecoration = data.textDecoration || 'none';
    textDiv.style.textAlign = data.textAlign || 'center';
    textDiv.style.left = data.left;
    textDiv.style.top = data.top;

    document.querySelector('.conteudo').appendChild(textDiv);
    makeDraggable(textDiv);
    return textDiv;
}

// OTIMIZADO: Função para selecionar e mostrar controles de TEXTO
function selectTextElement(element) {
    selectedTextElement = element;
    
    // Mostra controles específicos de texto
    freeTextContent.value = selectedTextElement.textContent;
    freeTextColor.value = rgbToHex(selectedTextElement.style.color);
    const fontSize = parseInt(selectedTextElement.style.fontSize);
    freeTextSizeSlider.value = fontSize;
    freeTextSizeValue.textContent = `${fontSize}px`;
    freeTextFontFamily.value = selectedTextElement.style.fontFamily;
    updateFormatButtonsState();
    freeTextControls.style.display = 'block';
    symbolControls.style.display = 'none';
}

// OTIMIZADO: Função para selecionar e mostrar controles de SÍMBOLO
function selectSymbolElement(element) {
    selectedTextElement = element;

    // Mostra controles específicos de símbolo
    symbolColor.value = rgbToHex(selectedTextElement.style.color);
    const fontSize = parseInt(selectedTextElement.style.fontSize);
    symbolSizeSlider.value = fontSize;
    symbolSizeValue.textContent = `${fontSize}px`;
    symbolControls.style.display = 'block';
    freeTextControls.style.display = 'none';
}


function updateFormatButtonsState() {
    if (!selectedTextElement) return;

    freeTextBold.classList.toggle('active', selectedTextElement.style.fontWeight === 'bold');
    freeTextItalic.classList.toggle('active', selectedTextElement.style.fontStyle === 'italic');
    freeTextUnderline.classList.toggle('active', selectedTextElement.style.textDecoration === 'underline');

    const alignment = selectedTextElement.style.textAlign || 'center';
    freeTextAlignLeft.classList.remove('active');
    freeTextAlignCenter.classList.remove('active');
    freeTextAlignRight.classList.remove('active');
    if (alignment === 'left') freeTextAlignLeft.classList.add('active');
    else if (alignment === 'center') freeTextAlignCenter.classList.add('active');
    else if (alignment === 'right') freeTextAlignRight.classList.add('active');
}

// Atualizada para esconder AMBOS os painéis de edição
function deselectTextElement() {
    selectedTextElement = null;
    freeTextControls.style.display = 'none';
    symbolControls.style.display = 'none';
}

function removeSelectedFreeText() {
    if (selectedTextElement) {
        selectedTextElement.remove();
        deselectAllLayers();
        recordHistory();
        updateLayersPanel();
    }
}

function rgbToHex(rgb) {
    if (!rgb || rgb.startsWith('#')) return rgb;
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    rgb = rgb.substr(4).split(")")[0].split(sep);
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;
    return "#" + r + g + b;
}


function saveListToLocalStorage() {
    const placas = [];
    for (let i = 0; i < listaPlacas.options.length; i++) {
        const option = listaPlacas.options[i];
        placas.push({
            text: option.textContent,
            data: option.dataset.placaData
        });
    }
    localStorage.setItem('fonsecaPlacasList', JSON.stringify(placas));
}

function loadListFromLocalStorage() {
    const savedPlacas = localStorage.getItem('fonsecaPlacasList');
    if (savedPlacas) {
        const placas = JSON.parse(savedPlacas);
        placas.forEach(placa => {
            const option = document.createElement('option');
            option.textContent = placa.text;
            option.dataset.placaData = placa.data;
            listaPlacas.appendChild(option);
        });
    }
}

function populateTemplateSelector() {
    TEMPLATES.forEach((template, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = template.name;
        templateSelector.appendChild(option);
    });
}

function applyTemplateState(templateData) {
    // Mescla o estado padrão com os dados do template
    const stateToApply = { ...DEFAULT_STATE, ...templateData };

    // Itera sobre o estado mesclado e aplica aos controles
    Object.keys(stateToApply).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (typeof stateToApply[key] === 'boolean') {
                element.classList.toggle('active', stateToApply[key]);
            } else {
                element.value = stateToApply[key];
            }
        }
    });

    // Trata os seletores de cor especiais
    const productOption = productColorOptions.querySelector(`[data-color-class="${stateToApply.productColor}"]`);
    if(productOption) {
        productColorOptions.querySelector('.selected')?.classList.remove('selected');
        productOption.classList.add('selected');
    }

    const priceOption = priceColorOptions.querySelector(`[data-color-class="${stateToApply.priceColor}"]`);
    if(priceOption) {
        priceColorOptions.querySelector('.selected')?.classList.remove('selected');
        priceOption.classList.add('selected');
    }

    // Reinicializa a placa para refletir todas as mudanças
    initializePlaca();
    recordHistory();
}


function applyTemplate(templateData, templateName) {
    applyTemplateState(templateData);

    toggleTemplateSelector.checked = true;
    templateSelectorContainer.style.display = 'block';

    showMessageBox('Modelo Aplicado', `O modelo "${templateName}" foi carregado com sucesso!`);
}

function resetToDefaultState() {
    applyTemplateState({});
    templateSelector.value = "";
    showMessageBox('Modelos Desativados', 'O layout foi redefinido para o padrão.');
}

function adicionarPlacaLista() {
    const produto = produtoName.value || 'PRODUTO';
    const preco = `${precoAtualReal.value || '0'},${String(precoAtualCentavos.value || '00').padStart(2, '0')}`;
    const unidade = unidadeText.value || 'UN';

    const displayText = `${produto} - R$ ${preco} ${unidade}`;

    const option = document.createElement('option');
    option.textContent = displayText;
    option.dataset.placaData = JSON.stringify(saveState());

    listaPlacas.appendChild(option);
    saveListToLocalStorage();
    showMessageBox('Sucesso', 'Placa adicionada à lista!');
    currentlyEditingIndex = -1; // Reseta o índice de edição
}

function alterarPlacaLista() {
    if (currentlyEditingIndex < 0) {
        showMessageBox('Atenção', 'Selecione uma placa da lista para poder alterar.');
        return;
    }
    const selectedOption = listaPlacas.options[currentlyEditingIndex];

    const produto = produtoName.value || 'PRODUTO';
    const preco = `${precoAtualReal.value || '0'},${String(precoAtualCentavos.value || '00').padStart(2, '0')}`;
    const unidade = unidadeText.value || 'UN';

    const displayText = `${produto} - R$ ${preco} ${unidade}`;

    selectedOption.textContent = displayText;
    selectedOption.dataset.placaData = JSON.stringify(saveState());

    saveListToLocalStorage();
    showMessageBox('Sucesso', 'Placa alterada com sucesso!');
}

function removerPlacaLista() {
    if (listaPlacas.selectedIndex >= 0) {
        listaPlacas.remove(listaPlacas.selectedIndex);
        saveListToLocalStorage();
        currentlyEditingIndex = -1; // Reseta o índice de edição
    } else {
        showMessageBox('Atenção', 'Selecione uma placa para remover.');
    }
}

function limparTodaLista() {
    listaPlacas.innerHTML = '';
    saveListToLocalStorage();
    currentlyEditingIndex = -1; // Reseta o índice de edição
}

function carregarPlacaDaLista() {
    if (listaPlacas.selectedIndex >= 0) {
        const state = JSON.parse(listaPlacas.options[listaPlacas.selectedIndex].dataset.placaData);
        restoreState(state);
        currentlyEditingIndex = listaPlacas.selectedIndex;
        recordHistory();
    }
}


async function exportarLoteComoPDF() {
    if (listaPlacas.options.length === 0) {
        showMessageBox('Atenção', 'A lista de placas está vazia.');
        return;
    }
    showMessageBox('Processando', 'Gerando PDF do lote... Isso pode levar alguns instantes.');

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const estadoAtual = saveState();

        for (let i = 0; i < listaPlacas.options.length; i++) {
            const state = JSON.parse(listaPlacas.options[i].dataset.placaData);
            restoreState(state);

            await new Promise(resolve => setTimeout(resolve, 150));

            deselectAllLayers();
            const handlesInLoop = placaA4.querySelectorAll('.resize-handle, .remove-image-btn');
            handlesInLoop.forEach(h => h.style.display = 'none');

            await new Promise(resolve => setTimeout(resolve, 50));

            const canvas = await html2canvas(placaA4, { scale: 2, useCORS: true, logging: false, allowTaint: true, backgroundColor: '#FFFFFF' });
            const imgData = canvas.toDataURL('image/png');

            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        }

        restoreState(estadoAtual);

        pdf.save('lote-de-placas.pdf');
        hideMessageBox();
        showMessageBox('Sucesso', 'Lote exportado como PDF com sucesso!');
    } catch (error) {
        console.error('Erro ao exportar lote como PDF:', error);
        hideMessageBox();
        showMessageBox('Erro', 'Ocorreu um erro ao exportar o lote como PDF.');
        restoreState(estadoAtual);
    }
}

async function exportPlaca(format, landscape = false) {
    const originalBoxShadow = placaA4.style.boxShadow;
    const handles = document.querySelectorAll('.resize-handle, .remove-image-btn');

    deselectAllLayers();
    placaA4.style.boxShadow = 'none';
    handles.forEach(h => h.style.display = 'none');

    try {
        await new Promise(resolve => setTimeout(resolve, 150));

        const canvas = await html2canvas(placaA4, { scale: 3, useCORS: true, logging: false, allowTaint: true, backgroundColor: '#FFFFFF' });
        if (format === 'png') {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'placa-promocional.png';
            link.href = image;
            link.click();
            showMessageBox('Sucesso!', `Placa exportada como ${format.toUpperCase()}!`);
        } else if (format === 'pdf') {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: landscape ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('placa-promocional.pdf');
            showMessageBox('Sucesso!', `Placa exportada como ${format.toUpperCase()}!`);
        }
    } catch (error) {
        console.error(`Erro ao exportar ${format.toUpperCase()}:`, error);
        showMessageBox('Erro', `Houve um problema ao exportar a placa. Tente novamente.`);
    } finally {
        placaA4.style.boxShadow = originalBoxShadow;
        handles.forEach(h => h.style.display = '');
    }
}

function setActivePanel(panelId) {
    controlPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    panelToggleButtons.forEach(button => {
        button.classList.remove('active');
    });

    const targetPanel = document.getElementById(panelId);
    const targetButton = document.querySelector(`.panel-toggle-button[data-panel="${panelId}"]`);

    if (targetPanel) {
        targetPanel.style.display = 'block';
    }
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

function _proceedToEditor() {
    welcomeContainer.style.display = 'none';
    editorContainer.style.display = 'flex';
    initializePlaca();
    loadLogoFromStorage();
    setActivePanel('panelPrincipal');
    recordHistory();
}

function showEditor() {
    if (listaPlacas.options.length > 0) {
        showConfirmationModal(
            "Lista de Placas Existente",
            "Você possui uma lista de placas salva. Deseja apagar a lista e começar uma nova ou continuar a edição?",
            "Apagar Lista",
            "Continuar Edição",
            () => {
                limparTodaLista();
                showMessageBox('Lista Apagada', 'A lista de placas foi limpa com sucesso.');
                _proceedToEditor();
            },
            () => {
                _proceedToEditor();
            }
        );
    } else {
        _proceedToEditor();
    }
}

function showWelcomeScreen() {
    editorContainer.style.display = 'none';
    welcomeContainer.style.display = 'flex';
}

async function saveProject() {
    try {
        const state = saveState();
        const jsonString = JSON.stringify(state, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });

        const productName = state.inputs.produtoName || 'projeto';
        const safeFileName = productName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${safeFileName}_placa.json`;

        if (window.showSaveFilePicker) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'Arquivo de Projeto JSON',
                        accept: { 'application/json': ['.json'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                showMessageBox('Sucesso', 'O projeto foi salvo com sucesso.');
                return;
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('O usuário cancelou o salvamento.');
                    return;
                }
                throw err;
            }
        }

        console.warn('A API showSaveFilePicker não é suportada neste navegador. Usando o método de fallback.');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showMessageBox('Sucesso', 'O projeto foi salvo como um arquivo .json na sua pasta de downloads.');

    } catch (error) {
        console.error('Erro ao salvar projeto:', error);
        showMessageBox('Erro', 'Ocorreu um erro inesperado ao salvar o projeto. Verifique o console para detalhes.');
    }
}


function handleProjectImport(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonContent = e.target.result;
            const state = JSON.parse(jsonContent);
            if (state && state.inputs && (state.elements || state.productImages || state.freeTexts)) {
                restoreState(state);
                recordHistory();
                showMessageBox('Sucesso', 'Projeto importado com sucesso!');
            } else {
                throw new Error('Formato de arquivo inválido.');
            }
        } catch (error) {
            console.error('Erro ao importar projeto:', error);
            showMessageBox('Erro', `Não foi possível importar o projeto. O arquivo pode estar corrompido ou não é um arquivo de projeto válido. (${error.message})`);
        } finally {
            event.target.value = '';
        }
    };
    reader.onerror = function() {
        showMessageBox('Erro', 'Ocorreu um erro ao ler o arquivo selecionado.');
        event.target.value = '';
    };
    reader.readAsText(file);
}


async function saveContactInfo() {
    const telefone = modalTelefoneText.value.trim();
    const endereco = modalEnderecoText.value.trim();
    const instagram = modalInstagramText.value.trim();

    if (!telefone || !endereco || !instagram) {
        configMessage.textContent = "Todos os campos (Telefone/WhatsApp, Endereço e Instagram) são obrigatórios.";
        configMessage.style.display = 'block';
        return;
    }

    configMessage.textContent = "Salvando informações...";
    configMessage.style.display = 'block';

    try {
        const response = await fetch('/save_contact_info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telefone, endereco, instagram }),
        });
        const data = await response.json();

        if (data.success) {
            configMessage.textContent = "Informações salvas! Reinicie o servidor para aplicar as alterações.";
            configMessage.style.color = '#2E8B57';
            loadContactInfo();
            setTimeout(() => { hideConfigModal(); }, 2000);
        } else {
            configMessage.textContent = data.message || "Erro ao salvar informações.";
            configMessage.style.color = 'var(--cor-primaria)';
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor para salvar informações:', error);
        configMessage.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
        configMessage.style.color = 'var(--cor-primaria)';
    }
}

function logout() {
    showWelcomeScreen();
}

async function exportForSocialMedia(aspectRatio, platformName) {
    showMessageBox('Processando...', `Otimizando imagem para ${platformName}. Por favor, aguarde.`);

    deselectAllLayers();

    const clone = placaA4.cloneNode(true);

    clone.style.width = '210mm';
    clone.style.height = '297mm';
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.borderRadius = '0';

    const cloneHandles = clone.querySelectorAll('.resize-handle, .remove-image-btn, .selected-layer');
    cloneHandles.forEach(h => h.style.display = 'none');

    document.body.appendChild(clone);

    await new Promise(resolve => setTimeout(resolve, 150));

    try {
        const sourceCanvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        document.body.removeChild(clone);

        const [aspectW, aspectH] = aspectRatio.split(':').map(Number);
        const targetWidth = 1080;
        const targetHeight = Math.round((targetWidth / aspectW) * aspectH);

        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = targetWidth;
        targetCanvas.height = targetHeight;
        const ctx = targetCanvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        const sourceAspectRatio = sourceCanvas.width / sourceCanvas.height;
        const targetAspectRatio = targetWidth / targetHeight;

        let drawWidth, drawHeight, x, y;

        if (sourceAspectRatio > targetAspectRatio) {
            drawWidth = targetWidth;
            drawHeight = drawWidth / sourceAspectRatio;
            x = 0;
            y = (targetHeight - drawHeight) / 2;
        } else {
            drawHeight = targetHeight;
            drawWidth = drawHeight * sourceAspectRatio;
            y = 0;
            x = (targetWidth - drawWidth) / 2;
        }

        ctx.drawImage(sourceCanvas, x, y, drawWidth, drawHeight);

        const finalImage = targetCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `placa_${platformName.toLowerCase().replace(/ /g, '_')}_otimizada.png`;
        link.href = finalImage;
        link.click();

        hideMessageBox();
        showMessageBox('Sucesso!', `Sua imagem otimizada para ${platformName} foi baixada.`);

    } catch (error) {
        console.error(`Erro ao otimizar imagem para ${platformName}:`, error);
        if (document.body.contains(clone)) {
            document.body.removeChild(clone);
        }
        hideMessageBox();
        showMessageBox('Erro', `Houve um problema ao gerar a imagem otimizada. Tente novamente.`);
    }
}

function createImageOnPlaca(src, id, styles = {}, isProductImage = true, name) {
    const existingImage = document.getElementById(id);
    if (existingImage) existingImage.remove();

    const container = document.createElement('div');
    container.id = id;
    container.classList.add('image-container', 'draggable', 'interactive-placa-element');
    container.dataset.name = name;
    container.dataset.targetPanel = 'panelImagem';

    if (isProductImage) {
        container.classList.add('product-image-container');
    }

    Object.assign(container.style, styles);

    const img = document.createElement('img');
    img.src = src;

    const handle = document.createElement('div');
    handle.classList.add('resize-handle');

    container.appendChild(img);
    container.appendChild(handle);

    if (isProductImage) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Remover Imagem';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            container.remove();
            recordHistory();
            updateLayersPanel();
        };
        container.appendChild(removeBtn);
    }

    placaA4.appendChild(container);
    makeDraggableAndResizable(container);
    return container;
}


function saveLogoPosition(left, top, width, height) {
    const savedLogo = JSON.parse(localStorage.getItem('companyLogo')) || {};
    savedLogo.left = left;
    savedLogo.top = top;
    savedLogo.width = width;
    savedLogo.height = height;
    localStorage.setItem('companyLogo', JSON.stringify(savedLogo));
}

function loadLogoFromStorage() {
    const savedLogo = JSON.parse(localStorage.getItem('companyLogo'));
    if (savedLogo && savedLogo.src) {
        createImageOnPlaca(savedLogo.src, 'companyLogoContainer', {
            left: savedLogo.left || '30px',
            top: savedLogo.top || '30px',
            width: savedLogo.width || '150px',
            height: savedLogo.height || 'auto'
        }, false, "Logo da Empresa");
    }
    updateLayersPanel();
}


// --- LÓGICA DO PAINEL DE CAMADAS ---
function updateLayersPanel(order = null) {
    const optionalContentElements = ['precoAntigoDisplay', 'ofertaComboDisplay', 'validadeDisplay'];
    layerList.innerHTML = '';
    
    let elements = [];
    if (order) {
        order.forEach(id => {
            const el = document.getElementById(id);
            if (el) elements.push(el);
        });
    } else {
        const currentOrder = Array.from(layerList.querySelectorAll('.layer-item')).map(item => item.dataset.targetId);
        if (currentOrder.length > 0) {
            currentOrder.forEach(id => {
                const el = document.getElementById(id);
                if (el) elements.push(el);
            });
        } else {
            elements = Array.from(placaA4.querySelectorAll('.interactive-placa-element'));
        }
    }
    
    elements.reverse().forEach(element => {
        if (element.closest('.interactive-placa-element') !== element) return;
        
        if (optionalContentElements.includes(element.id) && element.style.display === 'none') {
            return;
        }
        
        const layerItem = document.createElement('li');
        layerItem.className = 'layer-item';
        layerItem.dataset.targetId = element.id;
        layerItem.draggable = true;
        
        const layerName = document.createElement('span');
        layerName.className = 'layer-name';
        layerName.textContent = element.dataset.name || element.id;
        
        const actions = document.createElement('div');
        actions.className = 'layer-actions';
        
        const visibilityBtn = document.createElement('button');
        visibilityBtn.className = 'layer-action-btn';
        visibilityBtn.innerHTML = '<i class="fas fa-eye"></i>';
        visibilityBtn.title = 'Alternar Visibilidade';
        if (element.style.display === 'none') {
            visibilityBtn.classList.add('active');
            visibilityBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
        
        const lockBtn = document.createElement('button');
        lockBtn.className = 'layer-action-btn';
        lockBtn.innerHTML = '<i class="fas fa-unlock-alt"></i>';
        lockBtn.title = 'Bloquear/Desbloquear Camada';
        if (element.dataset.locked === 'true') {
            lockBtn.classList.add('active');
            lockBtn.innerHTML = '<i class="fas fa-lock"></i>';
        }
        
        visibilityBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLayerVisibility(element);
        });

        lockBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLayerLock(element);
        });
        
        actions.appendChild(visibilityBtn);
        if (element.classList.contains('draggable')) {
            actions.appendChild(lockBtn);
        }

        // OTIMIZADO: Adiciona o botão de deletar para camadas permitidas
        const isDeletable = element.classList.contains('product-image-container') ||
                            element.classList.contains('texto-livre-item') ||
                            element.id === 'ofertaComboDisplay' ||
                            element.id === 'validadeDisplay';

        if (isDeletable) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'layer-action-btn layer-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.title = 'Remover Camada';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showConfirmationModal(
                    "Confirmar Ação",
                    `Tem certeza de que deseja limpar/remover a camada "${element.dataset.name}"?`,
                    "Sim, Remover",
                    "Cancelar",
                    () => {
                        if (element.classList.contains('product-image-container') || element.classList.contains('texto-livre-item')) {
                            element.remove();
                        } else if (element.id === 'ofertaComboDisplay') {
                            ofertaComboText.value = '';
                            updateOfertaCombo();
                        } else if (element.id === 'validadeDisplay') {
                            validadeText.value = '';
                            updateValidade();
                        }
                        deselectAllLayers();
                        updateLayersPanel();
                        recordHistory();
                    },
                    null
                );
            });
            actions.appendChild(deleteBtn);
        }


        layerItem.appendChild(layerName);
        layerItem.appendChild(actions);
        layerList.appendChild(layerItem);

        layerItem.addEventListener('click', () => selectLayer(element));
    });
    applyZIndexFromPanel();
}

function applyZIndexFromPanel() {
    const layerItems = Array.from(layerList.querySelectorAll('.layer-item')).reverse();
    layerItems.forEach((item, index) => {
        const element = document.getElementById(item.dataset.targetId);
        if (element) {
            if (element.id === 'rodapeElement') {
                element.style.zIndex = 5;
            } else if (element.id === 'cabecalhoElement') {
                element.style.zIndex = 6;
            } else {
                element.style.zIndex = 10 + index;
            }
        }
    });
}

function selectLayer(element) {
    if (!element) return;
    
    deselectAllLayers();

    element.classList.add('selected-layer');
    
    const layerItem = layerList.querySelector(`.layer-item[data-target-id="${element.id}"]`);
    if (layerItem) {
        layerItem.classList.add('selected');
    }
    
    const targetPanelId = element.dataset.targetPanel;
    if (targetPanelId) {
        setActivePanel(targetPanelId);
    }
    
    if (element.classList.contains('texto-livre-item')) {
        if (element.dataset.type === 'symbol') {
            selectSymbolElement(element);
        } else {
            selectTextElement(element);
        }
    } else {
        deselectTextElement();
    }
}

function deselectAllLayers() {
    document.querySelectorAll('.selected-layer').forEach(el => el.classList.remove('selected-layer'));
    layerList.querySelectorAll('.selected').forEach(item => item.classList.remove('selected'));
    if (selectedTextElement) {
        selectedTextElement.classList.remove('selected');
    }
    deselectTextElement();
}

function toggleLayerVisibility(element) {
    const isVisible = element.style.display !== 'none';
    element.style.display = isVisible ? 'none' : '';
    
    const layerItemBtn = layerList.querySelector(`.layer-item[data-target-id="${element.id}"] .layer-action-btn:first-child`);
    if (layerItemBtn) {
        layerItemBtn.classList.toggle('active', !isVisible);
        layerItemBtn.innerHTML = isVisible ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    }
    recordHistory();
}

function toggleLayerLock(element) {
    const isLocked = element.dataset.locked === 'true';
    element.dataset.locked = !isLocked;
    
    const layerItemBtn = layerList.querySelector(`.layer-item[data-target-id="${element.id}"] .layer-action-btn:last-child`);
     if (layerItemBtn) {
        layerItemBtn.classList.toggle('active', !isLocked);
        layerItemBtn.innerHTML = isLocked ? '<i class="fas fa-unlock-alt"></i>' : '<i class="fas fa-lock"></i>';
    }
    recordHistory();
}


// --- INÍCIO: BLOCO DE EVENT LISTENERS (CORRIGIDO E UNIFICADO) ---
document.addEventListener('DOMContentLoaded', () => {
    // Funções iniciais
    showWelcomeScreen();
    loadListFromLocalStorage();
    populateTemplateSelector();
    initializeLayerDragAndDrop();

    // Adiciona os listeners para os elementos drag-and-drop
    makeDraggable(document.getElementById('produtoDisplay'));
    makeDraggable(document.getElementById('precoAntigoDisplay'));
    makeDraggable(document.getElementById('porCifraoGroup'));
    makeDraggable(document.getElementById('mainPriceGroup'));
    makeDraggable(document.getElementById('unidadeGroup'));
    makeDraggable(document.getElementById('ofertaComboDisplay'));
    makeDraggable(document.getElementById('validadeDisplay'));

    placaA4.addEventListener('click', (e) => {
        const clickedElement = e.target.closest('.interactive-placa-element');
        if (clickedElement) {
             selectLayer(clickedElement);
        } else {
             deselectAllLayers();
        }
    });

    // Adiciona listeners para todos os inputs de controle para o histórico de Desfazer/Refazer
    allControlInputs.forEach(input => {
        input.addEventListener('input', recordHistory);
        input.addEventListener('change', recordHistory);
    });
    productColorOptions.addEventListener('click', recordHistory);
    priceColorOptions.addEventListener('click', recordHistory);

    // Listeners para atualização em tempo real da placa
    promocaoText.addEventListener('input', updatePromocao);
    promocaoTextColor.addEventListener('input', updatePromocao);
    promocaoStyle.addEventListener('change', updatePromocao);

    produtoName.addEventListener('input', updateProduto);
    productColorOptions.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option')) {
            productColorOptions.querySelector('.color-option.selected').classList.remove('selected');
            e.target.classList.add('selected');
            updateProduto();
        }
    });
    // NOVOS LISTENERS PARA FORMATAÇÃO DO PRODUTO
    produtoFontFamily.addEventListener('change', () => {
        updateProduto();
        recordHistory();
    });
    [produtoBold, produtoItalic, produtoUnderline].forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            updateProduto();
            recordHistory();
        });
    });

    precoAntigoInput.addEventListener('input', () => {
        updatePrecoAntigo();
        const hasValue = precoAntigoInput.value.trim() !== '' && !isNaN(parseFloat(precoAntigoInput.value));
        precoAntigoSizeSlider.disabled = !hasValue;
    });
    precoAntigoSizeSlider.addEventListener('input', updatePrecoAntigo);

    precoAtualReal.addEventListener('input', updatePrecoAtual);
    precoAtualCentavos.addEventListener('input', updatePrecoAtual);
    cifraoSizeInput.addEventListener('input', updatePrecoAtual);

    precoPrincipalSizeSlider.addEventListener('input', () => {
        precoPrincipalSizeInput.value = precoPrincipalSizeSlider.value;
        updatePrecoAtual();
    });
    precoPrincipalSizeInput.addEventListener('input', () => {
        precoPrincipalSizeSlider.value = precoPrincipalSizeInput.value;
        updatePrecoAtual();
    });

    precoStyle.addEventListener('change', updatePrecoAtual);
    priceColorOptions.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option')) {
            priceColorOptions.querySelector('.color-option.selected').classList.remove('selected');
            e.target.classList.add('selected');
            updatePrecoAtual();
        }
    });

    unidadeText.addEventListener('input', updateUnidade);
    unidadeColor.addEventListener('change', updateUnidade);
    unidadeStyle.addEventListener('change', updateUnidade);
    ofertaComboText.addEventListener('input', updateOfertaCombo);
    ofertaComboTextColor.addEventListener('input', updateOfertaCombo);
    ofertaComboBorderColor.addEventListener('input', updateOfertaCombo);
    validadeText.addEventListener('input', updateValidade);
    rodapeColor.addEventListener('change', updateRodape);

    // Listeners dos botões principais e de navegação
    acessarEditorButton.addEventListener('click', showEditor);
    openConfigModalButton.addEventListener('click', showConfigModal);
    logoutButton.addEventListener('click', logout);
    topMenuSalvar.addEventListener('click', showSaveModal);
    topMenuCompartilhar.addEventListener('click', showSocialShareModal);
    undoButton.addEventListener('click', undo);
    redoButton.addEventListener('click', redo);

    // Listeners para salvar e importar
    saveProjectButton.addEventListener('click', saveProject);
    importProjectInput.addEventListener('change', handleProjectImport);

    // Listeners para a lista de placas
    adicionarLista.addEventListener('click', adicionarPlacaLista);
    alterarLista.addEventListener('click', alterarPlacaLista);
    removerLista.addEventListener('click', removerPlacaLista);
    limparLista.addEventListener('click', limparTodaLista);
    listaPlacas.addEventListener('change', carregarPlacaDaLista);
    exportarPdfLote.addEventListener('click', exportarLoteComoPDF);

    // Listeners para os modelos
    toggleTemplateSelector.addEventListener('change', () => {
        const isEnabled = toggleTemplateSelector.checked;
        templateSelectorContainer.style.display = isEnabled ? 'block' : 'none';

        if (!isEnabled) {
            resetToDefaultState();
        }
    });
    templateSelector.addEventListener('change', (event) => {
        const templateIndex = event.target.value;
        if (templateIndex !== "") {
            const template = TEMPLATES[templateIndex];
            applyTemplate(template.data, template.name);
        }
    });

    // Listeners para os modais
    messageBoxClose.addEventListener('click', hideMessageBox);
    socialShareClose.addEventListener('click', hideSocialShareModal);
    configModalClose.addEventListener('click', hideConfigModal);
    saveContactInfoButton.addEventListener('click', saveContactInfo);
    saveModalClose.addEventListener('click', hideSaveModal);
    savePngButton.addEventListener('click', () => {
        exportPlaca('png');
        hideSaveModal();
    });
    savePdfButton.addEventListener('click', () => {
        exportPlaca('pdf');
        hideSaveModal();
    });
    
    // --- ATUALIZAÇÃO: Listeners para a pré-visualização ---
    previewButton.addEventListener('click', showPreviewChoiceModal);
    previewChoiceModalClose.addEventListener('click', hidePreviewChoiceModal);
    previewCurrentButton.addEventListener('click', showCurrentEditPreview);
    previewListButton.addEventListener('click', startListPreview);
    
    closePreview.addEventListener('click', hidePreview);

    previewNextButton.addEventListener('click', () => {
        currentPreviewIndex = (currentPreviewIndex + 1) % previewListStates.length;
        displayListPreviewAtIndex(currentPreviewIndex);
    });

    previewPrevButton.addEventListener('click', () => {
        currentPreviewIndex = (currentPreviewIndex - 1 + previewListStates.length) % previewListStates.length;
        displayListPreviewAtIndex(currentPreviewIndex);
    });


    confirmYesButton.addEventListener('click', () => {
        hideConfirmationModal();
        if (confirmCallback) {
            confirmCallback();
        }
    });
    confirmNoButton.addEventListener('click', () => {
        hideConfirmationModal();
        if (cancelCallback) {
            cancelCallback();
        }
    });

    // Listeners para a navegação de painéis
    panelToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const panelId = button.dataset.panel;
            setActivePanel(panelId);
        });
    });

    imageUpload.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const id = `productImage_${productImageCounter++}`;
                    createImageOnPlaca(e.target.result, id, {}, true, `Imagem ${productImageCounter}`);
                    updateLayersPanel();
                };
                reader.readAsDataURL(file);
            });
            recordHistory();
            imageUpload.value = '';
        }
    });

    logoUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                logoPreview.src = e.target.result;
                logoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    saveLogoButton.addEventListener('click', () => {
        if (logoPreview.src && !logoPreview.src.endsWith('#')) {
            const savedLogo = JSON.parse(localStorage.getItem('companyLogo')) || {};
            savedLogo.src = logoPreview.src;
            localStorage.setItem('companyLogo', JSON.stringify(savedLogo));

            loadLogoFromStorage();
            showMessageBox('Sucesso', 'Logo salva com sucesso!');
            recordHistory();
        } else {
            showMessageBox('Atenção', 'Por favor, selecione uma imagem para a logo antes de salvar.');
        }
    });
    removeLogoButton.addEventListener('click', () => {
        localStorage.removeItem('companyLogo');
        const existingLogo = document.getElementById('companyLogoContainer');
        if (existingLogo) existingLogo.remove();
        logoPreview.style.display = 'none';
        logoPreview.src = '#';
        logoUpload.value = '';
        showMessageBox('Sucesso', 'Logo removida.');
        recordHistory();
        updateLayersPanel();
    });

    document.getElementById('shareWhatsapp').addEventListener('click', (e) => { e.preventDefault(); exportForSocialMedia('9:16', 'WhatsApp'); });
    document.getElementById('shareFacebook').addEventListener('click', (e) => { e.preventDefault(); exportForSocialMedia('4:5', 'Facebook'); });
    document.getElementById('shareTwitter').addEventListener('click', (e) => { e.preventDefault(); exportForSocialMedia('16:9', 'Twitter'); });
    document.getElementById('shareInstagram').addEventListener('click', (e) => { e.preventDefault(); exportForSocialMedia('9:16', 'Instagram Story'); });

    // Listeners para Texto Livre e Formatação
    addFreeTextButton.addEventListener('click', addFreeText);
    removeFreeTextButton.addEventListener('click', removeSelectedFreeText);

    freeTextContent.addEventListener('input', () => {
        if (selectedTextElement) {
            selectedTextElement.textContent = freeTextContent.value;
            recordHistory();
        }
    });
    freeTextColor.addEventListener('input', () => {
        if (selectedTextElement) {
            selectedTextElement.style.color = freeTextColor.value;
            recordHistory();
        }
    });
    freeTextSizeSlider.addEventListener('input', () => {
        if (selectedTextElement) {
            const newSize = freeTextSizeSlider.value;
            selectedTextElement.style.fontSize = `${newSize}px`;
            freeTextSizeValue.textContent = `${newSize}px`;
        }
    });
    freeTextSizeSlider.addEventListener('change', recordHistory);

    freeTextFontFamily.addEventListener('change', () => {
        if (selectedTextElement) {
            selectedTextElement.style.fontFamily = freeTextFontFamily.value;
            recordHistory();
        }
    });

    freeTextBold.addEventListener('click', () => {
        if (selectedTextElement) {
            selectedTextElement.style.fontWeight = selectedTextElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
            updateFormatButtonsState();
            recordHistory();
        }
    });

    freeTextItalic.addEventListener('click', () => {
        if (selectedTextElement) {
            selectedTextElement.style.fontStyle = selectedTextElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
            updateFormatButtonsState();
            recordHistory();
        }
    });

    freeTextUnderline.addEventListener('click', () => {
        if (selectedTextElement) {
            selectedTextElement.style.textDecoration = selectedTextElement.style.textDecoration === 'underline' ? 'none' : 'underline';
            updateFormatButtonsState();
            recordHistory();
        }
    });

    [freeTextAlignLeft, freeTextAlignCenter, freeTextAlignRight].forEach(button => {
        button.addEventListener('click', (e) => {
            if (selectedTextElement) {
                let alignValue = 'center';
                if (e.currentTarget.id === 'freeTextAlignLeft') alignValue = 'left';
                if (e.currentTarget.id === 'freeTextAlignRight') alignValue = 'right';

                selectedTextElement.style.textAlign = alignValue;
                updateFormatButtonsState();
                recordHistory();
            }
        });
    });

    // LISTENERS PARA OS NOVOS BOTÕES DE SÍMBOLOS
    document.querySelectorAll('.symbol-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const symbol = e.currentTarget.dataset.symbol;
            insertSymbolAsFreeText(symbol);
        });
    });

    // LISTENERS PARA OS NOVOS CONTROLES DE SÍMBOLOS
    symbolColor.addEventListener('input', () => {
        if (selectedTextElement) {
            selectedTextElement.style.color = symbolColor.value;
            recordHistory();
        }
    });
    symbolSizeSlider.addEventListener('input', () => {
        if (selectedTextElement) {
            const newSize = symbolSizeSlider.value;
            selectedTextElement.style.fontSize = `${newSize}px`;
            symbolSizeValue.textContent = `${newSize}px`;
        }
    });
    symbolSizeSlider.addEventListener('change', recordHistory);
    removeSymbolButton.addEventListener('click', removeSelectedFreeText);


    // Listeners para atalhos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            undo();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            redo();
        }
    });
});
// --- FIM: BLOCO DE EVENT LISTENERS ---