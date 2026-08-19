# Minha Galeria

Aplicativo mobile desenvolvido com Ionic Vue e Capacitor para capturar ou escolher fotos do dispositivo e organizá-las em uma galeria.

## Identificação

- **Nome do aluno:** Gustavo Pereira
- **Nome do curso:** Informatica
- **Unidade curricular:** Codificar aplicações para dispositivos moveis

## Funcionalidades

- Cadastro e login local;
- Acesso à tela inicial somente após autenticação;
- Botão flutuante para tirar fotos ou escolher imagens da galeria;
- Grade responsiva de fotos e remoção individual;
- Solicitação de permissões de câmera e fotos no Android;
- Tela Sobre com versão, termos de uso e termos de privacidade.

> Os dados de acesso ficam somente no armazenamento local do dispositivo. As fotos permanecem disponíveis durante a sessão do aplicativo.

## Como rodar

### Navegador

```bash
npm install
npm run dev
```

### Android Studio

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

No Android Studio, aguarde a sincronização do Gradle, conecte um dispositivo ou inicie um emulador e pressione **Run**. Ao adicionar fotos, aceite as permissões solicitadas pelo Android.
