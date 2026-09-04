# Posicionamento — a espinha de todo o material público

> **Regra (DEC-011):** todo o material público — `README.md`, publicação de lançamento,
> landing page, deck, descrição de repo, texto de loja — parte destas quatro perguntas,
> pela mesma ordem, com as mesmas respostas. Não se reinventa a mensagem por material.
>
> O nome ainda não está fixado (DEC-007). Onde aparece `[NOME]`, entra o nome final.
> Versão EN faz-se a partir desta quando o nome estiver decidido.

---

## 1. O QUÊ

`[NOME]` é uma ferramenta visual onde desenhas a arquitectura de um sistema **em camadas**
(L1–L5) e ela **impõe as regras de ligação enquanto desenhas**.

Não é um quadro branco. Num quadro branco ligas qualquer caixa a qualquer caixa e ninguém
te avisa. Aqui, em modo guiado, uma ligação inválida **não se consegue traçar** — a
ferramenta conhece as regras das camadas e não te deixa quebrá-las.

Junto ao desenho: mede o estado do diagrama (repouso / guiado / livre-correcto / erro),
descreve o fluxo em texto automaticamente, adapta o vocabulário das camadas a sete
sectores (engenharia, computação, negócios, medicina, logística, cibersegurança, educação),
e explica *porquê* quando algo está errado.

## 2. POR QUÊ

Porque quem desenha arquitectura em camadas **liga as caixas mal** — salta camadas, cria
dependências para fora do núcleo, fecha ciclos no sítio errado. E o diagrama não avisa:
continua a parecer válido.

Duas verdades incómodas por trás disto:
- **Um diagrama mente sobre a sua própria validade.** Só o revisor mais atento apanha uma
  seta invertida entre centenas.
- **Ninguém revê um diagrama como revê código.** Não há linter, não há CI, não há gate.

`[NOME]` fecha essa lacuna: torna a estrutura errada **impossível de traçar**. Ensina por
restrição, não por correcção depois do erro já estar no desenho.

## 3. PARA QUÊ

Para o diagrama deixar de ser *desenho* e passar a ser *prova*.

Alguém abre o teu diagrama e, em segundos: vê as camadas, vê que todas as ligações são
válidas (100%), lê o fluxo descrito em texto (`L1 → L2 ⊕ [L3A | L3B] → …`). Não precisa de
confiar em ti — a ferramenta já validou.

Usos concretos:
- **Aprender** arquitectura limpa fazendo, com a rede a impedir o erro
- **Projectar** um sistema antes de escrever a primeira linha
- **Rever** a arquitectura de outra pessoa sem a decifrar à mão
- **Documentar** de forma auditável — o diagrama é um ficheiro JSON versionável no repo

## 4. PARA QUEM

- Quem **aprende** arquitectura em camadas e quer uma rede que impeça o erro
- Quem **projecta** sistemas antes de os construir
- Quem **ensina** arquitectura de software
- Quem **revê** a arquitectura de sistemas alheios

---

## Como cada material usa isto

| Material | Como aplica as 4 perguntas |
|---|---|
| `README.md` | Abre com O QUÊ (1–2 frases) + um screenshot. Depois POR QUÊ (o problema), PARA QUÊ (a demo), PARA QUEM. Só depois: instalação, uso, licença. |
| Publicação de lançamento | Título = a promessa (deriva do O QUÊ). Corpo = POR QUÊ → PARA QUÊ com um GIF. Fecho = PARA QUEM + link. |
| Landing page | Hero = O QUÊ + CTA. Secções na ordem POR QUÊ / PARA QUÊ / PARA QUEM. |
| Descrição do repo (GitHub) | Uma frase: o O QUÊ comprimido. |
