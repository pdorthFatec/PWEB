document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS E CONSTANTES ---
    const modal = document.getElementById('modal-oferta');
    const btnCloseModal = document.querySelector('.close-modal');
    const btnOfertarOpen = document.getElementById('tab-ofertar-open'); 
    const formOferta = modal ? modal.querySelector('form') : null;
    
    // Elementos do formulário - USANDO O ATRIBUTO 'name' (Requer HTML Corrigido)
    const inputDestino = modal ? modal.querySelector('input[name="destino"]') : null;
    const inputData = modal ? modal.querySelector('input[name="dataPartida"]') : null; 
    const inputHora = modal ? modal.querySelector('input[name="horaPartida"]') : null;
    const selectTipo = modal ? modal.querySelector('select[name="tipoCarona"]') : null;
    const selectVagas = modal ? modal.querySelector('select[name="qtdVagas"]') : null;
    const textareaDescricao = modal ? modal.querySelector('textarea[name="descricao"]') : null;
    const modalTitle = modal ? modal.querySelector('.modal-header h2') : null;
    const modalConfirmBtn = modal ? modal.querySelector('.btn-confirm') : null;

    // ENDPOINT CORRETO DA SUA API
    const API_URL = 'http://191.252.210.114:5000/api/Caronas';
    
    // ----------------------------------------------------------------------
    // --- FUNÇÕES DE CARREGAMENTO E RENDERIZAÇÃO ---
    // ----------------------------------------------------------------------

    /**
     * Busca os dados de carona na API
     */
    async function fetchRides() {
        const resultsList = document.querySelector('.results-list');
        if (!resultsList) return; 

        resultsList.innerHTML = '<p style="text-align: center; padding: 50px; color: #7a7a7a;"><i class="fas fa-sync-alt fa-spin"></i> Carregando caronas da API...</p>';

        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const rides = await response.json();
            
            if (!Array.isArray(rides)) {
                 throw new Error("Resposta da API não é um array válido.");
            }
            
            renderRides(rides); 
            
        } catch (error) {
            console.error("Falha ao carregar caronas da API:", error);
            resultsList.innerHTML = `
                <div style="text-align: center; padding: 40px; border: 1px solid #fdd; background-color: #fee; border-radius: 8px;">
                    <p style="color: #d83d3e; font-weight: bold; margin-bottom: 10px;">Não foi possível carregar as caronas.</p>
                    <p style="color: #666; font-size: 0.9em;">Verifique a URL da API, o servidor e as configurações de CORS.</p>
                    <p style="color: #666; font-size: 0.8em; margin-top: 10px;">Detalhe: ${error.message}</p>
                </div>
            `;
        }
    }

    /**
     * Renderiza os cards de carona
     */
    function renderRides(rides) {
        const resultsList = document.querySelector('.results-list');
        resultsList.innerHTML = ''; 

        if (rides.length === 0) {
             resultsList.innerHTML = '<p style="text-align: center; padding: 50px; color: #7a7a7a;">Nenhuma carona encontrada.</p>';
             return;
        }

        rides.forEach(ride => {
            const id = ride.id; 
            const destino = ride.destino;
            const vagas = ride.qtdVagas || 'N/A';
            // Pega apenas HH:MM
            const hora = (ride.horaPartida || '').substring(0, 5); 
            const descricao = ride.descricao || 'Nenhuma descrição fornecida.';
            
            const dataPartida = ride.dataPartida;
            // Parsing de data robusto para garantir que new Date funcione no formato yyyy-mm-ddT00:00:00
            const dataFormatada = dataPartida ? new Date(dataPartida.split('T')[0] + 'T00:00:00').toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Data Indefinida';

            const tipoCarona = (ride.tipoCarona || '').toLowerCase();
            const tipoBadge = tipoCarona === 'filantropica' ? 
                              '<span class="badge badge-free">Solidária</span>' : 
                              '<span class="badge badge-cost">Igualitária</span>';
            
            const cardHtml = `
                <div class="ride-card" data-id="${id}">
                    <div class="card-header">
                        <h3>${destino}</h3>
                        <div class="card-badges">
                            ${tipoBadge}
                            <div class="card-actions">
                                <i class="fas fa-edit edit-ride-btn" data-id="${id}" title="Editar"></i> 
                                <i class="fas fa-trash delete-ride-btn" data-id="${id}" title="Excluir"></i>
                            </div>
                        </div>
                    </div>
                    <div class="card-info">
                        <span><i class="far fa-calendar-alt"></i> ${dataFormatada}</span>
                        <span><i class="far fa-clock"></i> ${hora}</span>
                        <span><i class="fas fa-users"></i> ${vagas} vagas</span>
                    </div>
                    <p class="card-desc">${descricao}</p>
                </div>
            `;
            resultsList.insertAdjacentHTML('beforeend', cardHtml);
        });
    }

    // ----------------------------------------------------------------------
    // --- FUNÇÃO DE EXCLUSÃO (DELETE) ---
    // ----------------------------------------------------------------------

    /**
     * Envia a requisição DELETE para a API
     */
    async function deleteRide(rideId) {
        const confirmation = confirm("Tem certeza que deseja excluir esta carona?");
        if (!confirmation) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${rideId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok || response.status === 204) {
                alert("Carona excluída com sucesso!");
                await fetchRides(); 
            } else {
                let errorMessage = `Falha ao excluir. Status: ${response.status}.`;
                const errorBody = await response.text(); 
                if (errorBody) {
                    try {
                        const jsonBody = JSON.parse(errorBody);
                        if (jsonBody.detail) {
                            errorMessage += ` Detalhe: ${jsonBody.detail}`;
                        }
                    } catch (e) {
                         errorMessage += ` Resposta: ${errorBody.substring(0, 100)}...`;
                    }
                }
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Erro ao tentar excluir a carona:", error);
            alert(`Erro ao excluir carona: ${error.message}`);
        }
    }

    // ----------------------------------------------------------------------
    // --- FUNÇÃO DE CRIAÇÃO/EDIÇÃO (POST/PUT) (CORRIGIDA) ---
    // ----------------------------------------------------------------------

    /**
     * Envia os dados da carona para a API (POST para novo, PUT para edição)
     */
    async function saveRide(rideData, mode, rideId = null) {
        const isNew = mode === 'new';
        const url = isNew ? API_URL : `${API_URL}/${rideId}`;
        const method = isNew ? 'POST' : 'PUT';
        
        // Formata a hora para HH:MM:SS para compatibilidade
        const horaFormatada = rideData.hora + ':00'; 
        
        let rideObject = {
            destino: rideData.destino,
            dataPartida: rideData.data, 
            horaPartida: horaFormatada, // Usa o formato corrigido HH:MM:SS
            qtdVagas: parseInt(rideData.vagas),
            tipoCarona: rideData.tipo === 'solidaria' ? 'Filantropica' : 'Igualitaria', 
            descricao: rideData.descricao,
        };
        
        // Se for EDIÇÃO (PUT), adiciona o ID (Obrigatório para o PUT)
        if (!isNew) {
            // Garante que o ID é um número
            rideObject.id = parseInt(rideId || 0); 
        }
        
        // CORREÇÃO: Usa o objeto rideObject plano diretamente, SEM a propriedade 'dto'
        const payload = rideObject; 
        
        // Desativa o botão
        modalConfirmBtn.disabled = true;
        modalConfirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(`Carona ${isNew ? 'ofertada' : 'editada'} com sucesso!`);
                modal.classList.remove('show'); 
                formOferta.reset(); 
                await fetchRides(); 
            } else {
                let errorText = `Falha ao ${isNew ? 'cadastrar' : 'salvar'}. Status: ${response.status}.`;
                const errorBody = await response.text();
                
                try {
                    const jsonBody = JSON.parse(errorBody);
                    // Lógica para erros de validação do ASP.NET Core
                    if (jsonBody.errors) { 
                        errorText += "\nErros de Validação:";
                        Object.entries(jsonBody.errors).forEach(([field, errors]) => {
                             errorText += `\n- ${field}: ${errors.join('; ')}`;
                        });
                    } else if (jsonBody.detail) {
                        errorText += ` Detalhe: ${jsonBody.detail}`;
                    }
                } catch (e) {
                     errorText += ` Resposta: ${errorBody.substring(0, 100)}...`;
                }
                
                throw new Error(errorText);
            }

        } catch (error) {
            console.error(`Erro fatal ao tentar ${isNew ? 'cadastrar' : 'editar'} a carona:`, error);
            alert(`Erro na operação (Verifique o console): ${error.message}`);
        } finally {
             // Reativa o botão (Resolve o problema de travamento)
            modalConfirmBtn.disabled = false;
            modalConfirmBtn.innerHTML = mode === 'new' ? '<i class="fas fa-car"></i> Confirmar Oferta' : '<i class="fas fa-save"></i> Salvar Edição';
        }
    }


    // ----------------------------------------------------------------------
    // --- LÓGICA DO MODAL (EDIÇÃO: FETCH real de dados) ---
    // ----------------------------------------------------------------------
    
    /**
     * Busca os detalhes de uma carona específica na API e preenche o modal.
     */
    async function loadRideData(rideId) {
        modalTitle.textContent = 'Carregando Dados...';

        try {
            const response = await fetch(`${API_URL}/${rideId}`);
            if (!response.ok) {
                 throw new Error(`Erro ao buscar dados. Status: ${response.status}`);
            }
            const data = await response.json(); 

            // Preenche os campos do formulário
            inputDestino.value = data.destino;
            inputHora.value = (data.horaPartida || '').substring(0, 5);
            selectVagas.value = data.qtdVagas;
            textareaDescricao.value = data.descricao || '';
            
            // Mapeia valor da API para o valor do SELECT
            const tipoMapped = (data.tipoCarona || '').toLowerCase() === 'filantropica' ? 'solidaria' : 'igualitaria';
            selectTipo.value = tipoMapped;
            
            // Tratamento especial para o input de data
            const rawDate = data.dataPartida ? data.dataPartida.split('T')[0] : '';
            inputData.type = 'date'; 
            inputData.value = rawDate;

            modalTitle.textContent = 'Editar Carona';
            
        } catch (error) {
            console.error(`Erro ao carregar carona ID ${rideId}:`, error);
            alert(`Não foi possível carregar os dados da carona para edição. Detalhe: ${error.message}`);
            modalTitle.textContent = 'Erro ao Editar Carona';
        }
    }

    function openModal(isEdit = false, rideId = null) {
        if (!modal) return;
        
        if (formOferta) formOferta.reset();
        if (inputData) inputData.type = isEdit ? 'date' : 'text'; 

        if (isEdit && rideId !== null) {
            modalTitle.textContent = 'Carregando...'; 
            modalConfirmBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Edição';
            
            formOferta.setAttribute('data-mode', 'edit');
            formOferta.setAttribute('data-ride-id', rideId);

            loadRideData(rideId); 
            
        } else {
            modalTitle.textContent = 'Ofertar Carona';
            modalConfirmBtn.innerHTML = '<i class="fas fa-car"></i> Confirmar Oferta';
            formOferta.setAttribute('data-mode', 'new');
            formOferta.removeAttribute('data-ride-id');
        }

        modal.classList.add('show');
    }
    
    // ----------------------------------------------------------------------
    // --- LISTENERS DE EVENTOS ---
    // ----------------------------------------------------------------------

    // 1. Abertura para NOVA OFERTA (Tab "Ofertar Carona")
    if (btnOfertarOpen) {
        btnOfertarOpen.addEventListener('click', (e) => {
            e.preventDefault(); 
            openModal(false); 
        });
    }

    // 2. Abertura para EDIÇÃO/EXCLUSÃO (Delegação de Eventos)
    document.addEventListener('click', (e) => {
        const editButton = e.target.closest('.edit-ride-btn');
        const deleteButton = e.target.closest('.delete-ride-btn');

        // Lógica de Edição
        if (editButton) {
            e.preventDefault(); 
            const rideId = editButton.getAttribute('data-id'); 
            openModal(true, rideId); 
        }

        // Lógica de Exclusão
        if (deleteButton) {
            e.preventDefault();
            const rideId = deleteButton.getAttribute('data-id');
            deleteRide(rideId); 
        }
    });

    // 3. Fechamento pelo "X" e pelo clique fora
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // 4. Lógica de Submissão (POST/PUT)
    if(formOferta) {
        formOferta.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const mode = formOferta.getAttribute('data-mode');
            const rideId = formOferta.getAttribute('data-ride-id');
            
            // Coleta de dados do formulário
            const rideData = {
                destino: inputDestino.value,
                data: inputData.value,
                hora: inputHora.value,
                tipo: selectTipo.value,
                vagas: selectVagas.value,
                descricao: textareaDescricao.value,
            };

            // Chama a função real para enviar/salvar os dados
            saveRide(rideData, mode, rideId);
        });
    }


    // --- LÓGICA DOS FILTROS (Expandir/Recolher) ---
    const toggleFilters = document.getElementById('toggle-filters');
    const filtersBody = document.getElementById('filters-body');
    const chevron = document.querySelector('.chevron-icon');

    if(toggleFilters && filtersBody) {
        if (filtersBody.style.display !== 'none') {
             chevron.classList.replace('fa-chevron-down', 'fa-chevron-up');
        }

        toggleFilters.addEventListener('click', () => {
            if (filtersBody.style.display !== 'none') {
                filtersBody.style.display = 'none';
                chevron.classList.replace('fa-chevron-up', 'fa-chevron-down');
            } else {
                filtersBody.style.display = 'block';
                chevron.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
    }

    // --- PONTO DE PARTIDA: INICIA O CARREGAMENTO DOS DADOS DA API ---
    fetchRides();
});