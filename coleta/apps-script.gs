/**
 * Além da Média — receptor de respostas (Google Apps Script)
 *
 * Cada vez que um aluno clica em "Enviar respostas", o widget manda o mesmo
 * JSON que hoje é baixado. Este script:
 *   1. guarda o JSON completo como arquivo numa pasta do Google Drive
 *      (o painel do professor lê esses arquivos sem nenhuma mudança);
 *   2. acrescenta linhas na planilha, em três abas:
 *        entregas  – uma linha por envio
 *        resumo    – uma linha por aluno × pergunta, em cada envio
 *        eventos   – uma linha por ação registrada, em cada envio
 *
 * Um aluno pode enviar mais de uma vez (por exemplo, ao terminar outra parte).
 * Cada envio tem um entrega_id; para a análise, use o envio mais recente de
 * cada aluno (coluna "recebido_em" da aba entregas).
 *
 * Como implantar: veja coleta/COMO-IMPLANTAR.md.
 */

// Nome da pasta do Drive onde ficam os arquivos .json recebidos.
const PASTA = 'Além da Média – respostas recebidas';
// Rejeita envios maiores que isto (proteção contra abuso). 5 MB.
const TAMANHO_MAX = 5 * 1024 * 1024;
// Só aceita JSON cuja "versao" comece com um destes prefixos.
const VERSOES_ACEITAS = ['alem-da-media'];

const COLS_ENTREGAS = ['recebido_em', 'entrega_id', 'modulo', 'versao', 'aluno_id', 'turma', 'curso',
  'exportado_em', 'n_perguntas_respondidas', 'n_eventos', 'arquivo'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const corpo = e && e.postData ? e.postData.contents : '';
    if (!corpo) return resposta_({ ok: false, erro: 'vazio' });
    if (corpo.length > TAMANHO_MAX) return resposta_({ ok: false, erro: 'grande_demais' });

    let d;
    try { d = JSON.parse(corpo); } catch (err) { return resposta_({ ok: false, erro: 'json_invalido' }); }
    const versao = String(d.versao || '');
    if (!VERSOES_ACEITAS.some(v => versao.indexOf(v) === 0)) return resposta_({ ok: false, erro: 'versao_desconhecida' });

    const aluno = limpa_(d.aluno_id) || 'anonimo';
    const turma = limpa_(d.turma);
    const curso = limpa_(d.curso);
    const modulo = limpa_(d.modulo || versao.replace(/-v\d+$/, ''));
    const entregaId = limpa_(d.entrega_id) || Utilities.getUuid();
    const agora = new Date();

    lock.waitLock(30000);

    // 1. arquivo .json no Drive
    const nome = ['respostas', modulo, turma || 'sem-turma', aluno,
      Utilities.formatDate(agora, 'America/Sao_Paulo', "yyyy-MM-dd'T'HHmmss")].join('_')
      .replace(/[^\w.\-]+/g, '-') + '.json';
    const arquivo = pasta_().createFile(nome, corpo, MimeType.PLAIN_TEXT);

    // 2. planilha
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const resumo = Array.isArray(d.resumo) ? d.resumo : [];
    const eventos = Array.isArray(d.eventos) ? d.eventos : [];
    const respondidas = resumo.filter(r => Number(r.tentativas) > 0).length;

    acrescenta_(ss, 'entregas', COLS_ENTREGAS, [{
      recebido_em: agora, entrega_id: entregaId, modulo: modulo, versao: versao,
      aluno_id: aluno, turma: turma, curso: curso, exportado_em: d.exportado_em || '',
      n_perguntas_respondidas: respondidas, n_eventos: eventos.length, arquivo: arquivo.getUrl()
    }]);
    const extra = { entrega_id: entregaId, modulo: modulo, recebido_em: agora };
    acrescenta_(ss, 'resumo', null, resumo.map(r => Object.assign({}, extra, r)));
    acrescenta_(ss, 'eventos', null, eventos.map(r => Object.assign({}, extra, r)));

    return resposta_({ ok: true, entrega_id: entregaId, recebido_em: agora.toISOString(),
      perguntas_respondidas: respondidas, eventos: eventos.length });
  } catch (err) {
    return resposta_({ ok: false, erro: 'falha_interna', detalhe: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (err) { /* nada */ }
  }
}

// Abrir a URL do app no navegador mostra se ele está no ar.
function doGet() {
  return resposta_({ ok: true, servico: 'Além da Média – coleta', versoes: VERSOES_ACEITAS });
}

/* ---------- auxiliares ---------- */

function resposta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function limpa_(v) {
  return String(v == null ? '' : v).trim().slice(0, 120);
}

function pasta_() {
  const it = DriveApp.getFoldersByName(PASTA);
  return it.hasNext() ? it.next() : DriveApp.createFolder(PASTA);
}

/**
 * Acrescenta linhas a uma aba, criando-a se preciso. As colunas são as do
 * cabeçalho existente; colunas novas que apareçam nos dados entram no fim.
 */
function acrescenta_(ss, nomeAba, colunasFixas, linhas) {
  if (!linhas.length) return;
  let aba = ss.getSheetByName(nomeAba);
  if (!aba) aba = ss.insertSheet(nomeAba);
  let cab = aba.getLastRow() > 0 ? aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0].map(String) : [];
  const desejadas = colunasFixas || ['entrega_id', 'modulo', 'recebido_em'];
  const todas = desejadas.slice();
  linhas.forEach(l => Object.keys(l).forEach(k => { if (todas.indexOf(k) < 0) todas.push(k); }));
  const novas = todas.filter(k => cab.indexOf(k) < 0);
  if (novas.length) {
    aba.getRange(1, cab.length + 1, 1, novas.length).setValues([novas]);
    cab = cab.concat(novas);
    aba.setFrozenRows(1);
  }
  const valores = linhas.map(l => cab.map(k => {
    const v = l[k];
    if (v == null) return '';
    if (typeof v === 'object' && !(v instanceof Date)) return JSON.stringify(v);
    // Texto que começa com = + - @ viraria fórmula na planilha: guarda como texto.
    if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
    return v;
  }));
  aba.getRange(aba.getLastRow() + 1, 1, valores.length, cab.length).setValues(valores);
}
