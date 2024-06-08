"use strict";
let estadoInicial = {
    tarefas: [
        {
            descricao: 'Tarefa concluída',
            concluida: true
        },
        {
            descricao: 'Tarefa pendente 1',
            concluida: false
        },
        {
            descricao: 'Tarefa pendente 2',
            concluida: false
        }
    ],
    tarefaSelecionada: null,
};
const selecionarTarefa = (estado, tarefa) => {
    return Object.assign(Object.assign({}, estado), { tarefaSelecionada: tarefa === estado.tarefaSelecionada ? null : tarefa });
};
const adicionaTarefa = (estado, tarefa) => {
    return Object.assign(Object.assign({}, estado), { tarefas: [...estado.tarefas, tarefa] });
};
const editarTarefa = (estado, tarefa) => {
    const novasTarefas = estado.tarefas.map(t => t === estado.tarefaSelecionada ? Object.assign(Object.assign({}, t), { descricao: tarefa.descricao }) : t);
    return Object.assign(Object.assign({}, estado), { tarefas: novasTarefas, tarefaSelecionada: null });
};
const removerTarefaSelecionada = (estado, tarefa) => {
    const novaLista = estadoInicial.tarefas.filter((task) => {
        return task !== estadoInicial.tarefaSelecionada;
    });
    return Object.assign(Object.assign({}, estado), { tarefas: novaLista });
};
const atualizarUI = () => {
    const taskIconSvg = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF" />
            <path
                d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E" />
        </svg>
    `;
    const ulTarefas = document.querySelector('.app__section-task-list');
    const formAdicionarTarefa = document.querySelector('.app__form-add-task');
    const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
    const textarea = document.querySelector('.app__form-textarea');
    const activeTaskDescription = document.querySelector('.app__section-active-task-description');
    const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
    const btnRemoverTodas = document.querySelector('#btn-remover-todas');
    const btnCancelarAddEditarTarefa = document.querySelector('.app__form-footer__button--cancel');
    const btnDeletarTarefa = document.querySelector('.app__form-footer__button--delete');
    const tituloFormularioAdicionarTarefa = document.querySelector('.app__form-label');
    if (!btnAdicionarTarefa) {
        throw Error("Caro colega, o elemento btnAdicionarTarefa não foi encontrado. Favor rever.");
    }
    if (!btnRemoverConcluidas) {
        throw Error("Caro coleta, o elemento btnRemoverConcluidas não foi encontrado. Favor rever.");
    }
    if (!btnRemoverTodas) {
        throw Error("Caro coleta, o elemento btnRemoverTodas não foi encontrado. Favor rever.");
    }
    btnAdicionarTarefa.onclick = () => {
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.toggle('hidden');
        tituloFormularioAdicionarTarefa.textContent = 'Adicionando tarefa';
        textarea.value = "";
    };
    btnRemoverConcluidas.onclick = () => {
        const novoEstado = estadoInicial.tarefas.filter((tarefa) => {
            return !tarefa.concluida;
        });
        estadoInicial = Object.assign(Object.assign({}, estadoInicial), { tarefas: novoEstado });
        atualizarUI();
    };
    btnRemoverTodas.onclick = () => {
        estadoInicial = Object.assign(Object.assign({}, estadoInicial), { tarefas: [] });
        atualizarUI();
    };
    formAdicionarTarefa.onsubmit = (evento) => {
        evento.preventDefault();
        const descricao = textarea.value;
        if (estadoInicial.tarefaSelecionada) {
            estadoInicial = editarTarefa(estadoInicial, Object.assign(Object.assign({}, estadoInicial.tarefaSelecionada), { descricao }));
            console.log('editando ', estadoInicial);
        }
        else {
            estadoInicial = adicionaTarefa(estadoInicial, {
                descricao,
                concluida: false
            });
            console.log('adicionando ', estadoInicial);
        }
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.add('hidden');
        atualizarUI();
    };
    if (ulTarefas) {
        ulTarefas.innerHTML = '';
    }
    estadoInicial.tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.classList.add('app__section-task-list-item');
        const svgIcon = document.createElement('svg');
        svgIcon.innerHTML = taskIconSvg;
        const paragraph = document.createElement('p');
        paragraph.classList.add('app__section-task-list-item-description');
        paragraph.textContent = tarefa.descricao;
        const button = document.createElement('button');
        button.classList.add('app_button-edit');
        const editIcon = document.createElement('img');
        editIcon.setAttribute('src', '/imagens/edit.png');
        button.appendChild(editIcon);
        if (tarefa.concluida) {
            button.setAttribute('disabled', 'true');
            li.classList.add('app__section-task-list-item-complete');
        }
        li.appendChild(svgIcon);
        li.appendChild(paragraph);
        li.appendChild(button);
        if (tarefa === estadoInicial.tarefaSelecionada) {
            li.classList.add('app__section-task-list-item-active');
        }
        li.addEventListener('click', () => {
            console.log('A tarefa foi clicada', tarefa);
            activeTaskDescription.innerHTML = `${tarefa.descricao}`;
            estadoInicial = selecionarTarefa(estadoInicial, tarefa);
            atualizarUI();
        });
        svgIcon.addEventListener('click', () => {
            console.log('icone foi clicado');
            tarefa.concluida = !tarefa.concluida;
            console.log('tarefa.concluida', tarefa.concluida);
            estadoInicial = selecionarTarefa(estadoInicial, tarefa);
            atualizarUI();
        });
        editIcon.onclick = (evento) => {
            evento.stopPropagation();
            estadoInicial = selecionarTarefa(estadoInicial, tarefa);
            textarea.value = tarefa.descricao;
            tituloFormularioAdicionarTarefa.textContent = 'Editando tarefa';
            formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.remove('hidden');
        };
        btnCancelarAddEditarTarefa.onclick = () => {
            formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.add('hidden');
        };
        btnDeletarTarefa.onclick = () => {
            estadoInicial = removerTarefaSelecionada(estadoInicial, tarefa);
            formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.add('hidden');
            atualizarUI();
        };
        ulTarefas === null || ulTarefas === void 0 ? void 0 : ulTarefas.appendChild(li);
    });
};
atualizarUI();
