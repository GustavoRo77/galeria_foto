<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Minhas fotos</ion-title>
 
        <ion-buttons slot="end">
          <ion-button aria-label="Sair" @click="handleLogout">
            <ion-icon slot="icon-only" :icon="logOutOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
 
    <ion-content class="home-content">
      <section class="welcome">
        <span>Ola, {{ currentUser?.name || 'usuario' }}</span>
        <h1>Galeria</h1>
      </section>
 
      <div v-if="photos.length" class="photo-grid">
        <article
          v-for="photo in photos"
          :key="photo.id"
          class="photo-tile"
        >
          <img :src="photo.src" alt="Foto selecionada" />
 
          <ion-button
            class="remove-button"
            color="danger"
            size="small"
            shape="round"
            aria-label="Remover foto"
            @click="removePhoto(photo.id)"
          >
            <ion-icon
              slot="icon-only"
              :icon="trashOutline"
            />
          </ion-button>
        </article>
      </div>
 
      <ion-card v-else class="empty-state">
        <ion-card-content>
          Nenhuma foto escolhida. Use o botao inferior para abrir
          a camera ou a galeria.
        </ion-card-content>
      </ion-card>
 
      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
      >
        <ion-fab-button
          aria-label="Adicionar foto"
          @click="openPhotoOptions"
        >
          <ion-icon :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
 
<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  actionSheetController,
  toastController
} from '@ionic/vue'
 
import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera'
 
import {
  Directory,
  Filesystem
} from '@capacitor/filesystem'
 
import {
  addOutline,
  cameraOutline,
  imagesOutline,
  logOutOutline,
  trashOutline
} from 'ionicons/icons'
 
import {
  onMounted,
  ref
} from 'vue'
 
import { useRouter } from 'vue-router'
 
import {
  currentUserName,
  logout
} from '@/services/auth'
 
 
// ========================================
// INTERFACE DAS FOTOS
// ========================================
 
interface PhotoItem {
  id: string
  src: string
  path: string
}
 
 
// ========================================
// CONFIGURAÇÕES
// ========================================
 
const PHOTOS_KEY = 'galeria_foto_photos'
 
const router = useRouter()
 
const photos = ref<PhotoItem[]>([])
 
const currentUser = { name: currentUserName() }
 
 
// ========================================
// TOAST
// ========================================
 
async function showToast(
  message: string,
  color = 'primary'
) {
  const toast = await toastController.create({
    message,
    color,
    duration: 2200,
    position: 'bottom'
  })
 
  await toast.present()
}
 
 
// ========================================
// SALVAR LISTA DE FOTOS
// ========================================
 
function savePhotos() {
  localStorage.setItem(
    PHOTOS_KEY,
    JSON.stringify(photos.value)
  )
}
 
 
// ========================================
// CARREGAR FOTOS
// ========================================
 
async function loadPhotos() {
  try {
    const savedPhotos =
      localStorage.getItem(PHOTOS_KEY)
 
    if (!savedPhotos) {
      photos.value = []
      return
    }
 
    const saved =
      JSON.parse(savedPhotos) as PhotoItem[]
 
    const loadedPhotos: PhotoItem[] = []
 
    for (const photo of saved) {
      try {
        const file =
          await Filesystem.readFile({
            path: photo.path,
            directory: Directory.Data
          })
 
        loadedPhotos.push({
          id: photo.id,
          path: photo.path,
          src: `data:image/jpeg;base64,${file.data}`
        })
      } catch (error) {
        console.error(
          'Erro ao carregar foto:',
          photo.path,
          error
        )
      }
    }
 
    photos.value = loadedPhotos
 
    savePhotos()
 
  } catch (error) {
    console.error(
      'Erro ao carregar fotos:',
      error
    )
 
    photos.value = []
  }
}
 
 
// ========================================
// SALVAR UMA IMAGEM NO FILESYSTEM
// ========================================
 
async function salvarImagem(
  dataUrl: string,
  id: string
) {
  const base64Data =
    dataUrl.split(',')[1]
 
  if (!base64Data) {
    throw new Error(
      'Formato de imagem inválido'
    )
  }
 
  const path = `foto-${id}.jpg`
 
  await Filesystem.writeFile({
    path,
    data: base64Data,
    directory: Directory.Data
  })
 
  return path
}
 
 
// ========================================
// ADICIONAR FOTO
// ========================================
 
async function addPhoto(
  source: CameraSource
) {
  try {
 
    // Solicita permissão
    const permission =
      await Camera.requestPermissions({
        permissions:
          source === CameraSource.Camera
            ? ['camera']
            : ['photos']
      })
 
 
    // Verifica permissão
    const allowed =
      source === CameraSource.Camera
        ? permission.camera === 'granted'
        : permission.photos === 'granted' ||
          permission.photos === 'limited'
 
 
    if (!allowed) {
      await showToast(
        'Permissao negada para acessar este recurso.',
        'danger'
      )
 
      return
    }
 
 
    // Abre câmera ou galeria
    const photo =
      await Camera.getPhoto({
        resultType:
          CameraResultType.DataUrl,
 
        source,
 
        quality: 85,
 
        width: 1200
      })
 
 
    // Verifica se recebeu a imagem
    if (!photo.dataUrl) {
      return
    }
 
 
    // Cria ID único
    const id =
      crypto.randomUUID()
 
 
    // Salva imagem no Filesystem
    const path =
      await salvarImagem(
        photo.dataUrl,
        id
      )
 
 
    // Adiciona a nova foto
    // sem apagar as anteriores
    photos.value = [
      {
        id,
        src: photo.dataUrl,
        path
      },
      ...photos.value
    ]
 
 
    // Salva a lista
    savePhotos()
 
 
    await showToast(
      'Foto adicionada com sucesso!',
      'success'
    )
 
  } catch (error) {
 
    // Usuário cancelou
    if (
      String(error)
        .toLowerCase()
        .includes('cancel')
    ) {
      return
    }
 
 
    console.error(
      'Erro ao adicionar foto:',
      error
    )
 
 
    await showToast(
      'Nao foi possivel carregar a foto.',
      'danger'
    )
  }
}
 
 
// ========================================
// OPÇÕES: CÂMERA OU GALERIA
// ========================================
 
async function openPhotoOptions() {
 
  const actionSheet =
    await actionSheetController.create({
      header: 'Adicionar foto',
 
      buttons: [
 
        {
          text: 'Camera',
 
          icon: cameraOutline,
 
          handler: () =>
            addPhoto(
              CameraSource.Camera
            )
        },
 
        {
          text: 'Galeria',
 
          icon: imagesOutline,
 
          handler: () =>
            addPhoto(
              CameraSource.Photos
            )
        },
 
        {
          text: 'Cancelar',
 
          role: 'cancel'
        }
 
      ]
    })
 
 
  await actionSheet.present()
}
 
 
// ========================================
// REMOVER FOTO
// ========================================
 
async function removePhoto(
  id: string
) {
  try {
 
    // Procura a foto
    const photo =
      photos.value.find(
        (item) => item.id === id
      )
 
 
    if (!photo) {
      return
    }
 
 
    // Apaga o arquivo do Filesystem
    await Filesystem.deleteFile({
      path: photo.path,
      directory: Directory.Data
    })
 
 
    // Remove somente essa foto
    photos.value =
      photos.value.filter(
        (item) => item.id !== id
      )
 
 
    // Atualiza lista
    savePhotos()
 
 
    await showToast(
      'Foto removida.',
      'success'
    )
 
  } catch (error) {
 
    console.error(
      'Erro ao remover foto:',
      error
    )
 
 
    await showToast(
      'Nao foi possivel remover a foto.',
      'danger'
    )
  }
}
 
 
// ========================================
// LOGOUT
// ========================================
 
async function handleLogout() {
 
  logout()
 
  await router.replace('/login')
}
 
 
// ========================================
// INICIALIZAÇÃO
// ========================================
 
onMounted(() => {
  loadPhotos()
})
</script>
