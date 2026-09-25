# Além da Média

Roteiro interativo de estatística sobre **média, variação e risco**, com registro das respostas dos alunos e um painel para o professor. Material da disciplina TCC III da Licenciatura em Matemática do INFES/UFF.

> Dois ônibus podem levar o mesmo tempo em média e, mesmo assim, um deles fazer você perder a prova.

## Arquivos

| Arquivo | O que é |
|---|---|
| `alem-da-media.html` | Widget do aluno. Abre em qualquer navegador e funciona offline. |
| `painel-professor.html` | Junta os arquivos `.json` dos alunos e gera tabelas e planilhas. |
| `exemplos/` | 8 arquivos **fictícios** (turma "EXEMPLO") para testar o painel. |
| `LEIA-ME.txt` | Instruções para aluno e professor (versão em texto simples). |

## Uso rápido

**Aluno:** abrir `alem-da-media.html`, preencher código e turma, responder o roteiro e clicar em "Baixar respostas (.json)".

**Professor:** abrir `painel-professor.html` e arrastar os `.json` recebidos. As planilhas exportadas são CSV com `;` e vírgula decimal:

```python
pd.read_csv("arquivo.csv", sep=";", decimal=",")
```

```r
read.csv2("arquivo.csv", fileEncoding = "UTF-8-BOM")
```

Os detalhes do que é registrado estão em `LEIA-ME.txt`.

## Privacidade

Os dados ficam só no navegador do aluno até ele baixar o arquivo. Prefira códigos no lugar de nomes. Se os dados forem usados em pesquisa publicada, é preciso consentimento dos participantes e aprovação no Comitê de Ética (Resolução CNS 510/2016).

## Histórico

- **25/09/2026** — versão 1 (pacote `alem-da-media-pacote.zip`).
