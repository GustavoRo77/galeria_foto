<template>
  <ion-page>
    <ion-content class="login-content">
      <main class="auth-container">
        <section class="brand">
          <ion-icon :icon="imagesOutline" />
          <h1>Minha Galeria</h1>
          <p>Guarde os seus melhores momentos.</p>
        </section>
        <ion-card>
          <ion-card-header><ion-card-title>Entrar</ion-card-title></ion-card-header>
          <ion-card-content>
            <ion-item><ion-input v-model="email" type="email" label="E-mail" label-placement="stacked" placeholder="voce@email.com" /></ion-item>
            <ion-item><ion-input v-model="password" type="password" label="Senha" label-placement="stacked" placeholder="Sua senha" /></ion-item>
            <ion-button expand="block" class="ion-margin-top" @click="submit">Acessar galeria</ion-button>
            <p class="auth-link">Ainda não tem conta? <router-link to="/cadastro">Cadastre-se</router-link></p>
          </ion-card-content>
        </ion-card>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonInput, IonItem, IonPage, toastController } from '@ionic/vue';
import { imagesOutline } from 'ionicons/icons';
import { login } from '@/services/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
async function submit() {
  if (!email.value || !password.value) return showToast('Informe e-mail e senha.', 'warning');
  if (!login(email.value.trim(), password.value)) return showToast('E-mail ou senha inválidos.', 'danger');
  await router.replace('/home');
}
async function showToast(message: string, color: string) { const toast = await toastController.create({ message, color, duration: 2200, position: 'bottom' }); await toast.present(); }
</script>

<style scoped>
.login-content { --background: linear-gradient(160deg, #eef5ff, #f9fbff); }
.auth-container { max-width: 440px; margin: auto; padding: 72px 20px 24px; }
.brand { text-align: center; color: var(--ion-color-primary); margin-bottom: 34px; }
.brand ion-icon { font-size: 60px; }.brand h1 { font-size: 30px; margin: 10px 0 6px; }.brand p { color: #53657d; margin: 0; }
.auth-link { text-align: center; margin: 22px 0 4px; color: #53657d; }
</style>
