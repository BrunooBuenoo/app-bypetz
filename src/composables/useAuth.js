import { ref, computed } from "vue"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"

const user = ref(null)
const loading = ref(true)
const error = ref(null)

// Lista de e-mails de administradores
const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []


export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value)

  const userDisplayName = computed(() =>
    user.value?.displayName || user.value?.email || "Usuário"
  )

  const isAdmin = computed(() => {
    const email = user.value?.email?.toLowerCase()?.trim()
    return email && adminEmails.includes(email)
  })

  const createUserProfile = async (userData) => {
    try {
      const userRef = doc(db, "users", userData.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName || "",
          photoURL: userData.photoURL || "",
          createdAt: new Date().toISOString(),
          pets: [],
        })
      }
    } catch (err) {
      console.error("Erro ao criar perfil:", err)
    }
  }

  const login = async (email, password) => {
    try {
      loading.value = true
      error.value = null

      const result = await signInWithEmailAndPassword(auth, email, password)
      await createUserProfile(result.user)

      return { success: true, user: result.user }
    } catch (err) {
      console.error("Erro no login:", err)
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (email, password, displayName) => {
    try {
      loading.value = true
      error.value = null

      const result = await createUserWithEmailAndPassword(auth, email, password)

      if (displayName) {
        await updateProfile(result.user, { displayName })
      }

      await createUserProfile({
        ...result.user,
        displayName: displayName || "",
      })

      return { success: true, user: result.user }
    } catch (err) {
      console.error("Erro no registro:", err)
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async () => {
    try {
      loading.value = true
      error.value = null

      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await createUserProfile(result.user)

      return { success: true, user: result.user }
    } catch (err) {
      console.error("Erro no login Google:", err)
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      return { success: true }
    } catch (err) {
      console.error("Erro no logout:", err)
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  const resetPassword = async (email) => {
    try {
      loading.value = true
      error.value = null

      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (err) {
      console.error("Erro ao resetar senha:", err)
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      "auth/user-not-found": "Usuário não encontrado",
      "auth/wrong-password": "Senha incorreta",
      "auth/email-already-in-use": "Este e-mail já está em uso",
      "auth/weak-password": "A senha deve ter pelo menos 6 caracteres",
      "auth/invalid-email": "E-mail inválido",
      "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde",
      "auth/network-request-failed": "Erro de conexão. Verifique sua internet",
      "auth/popup-closed-by-user": "Login cancelado pelo usuário",
      "auth/configuration-not-found": "Configuração do Firebase não encontrada",
      "auth/invalid-api-key": "Chave de API inválida",
    }

    return errorMessages[errorCode] || `Erro: ${errorCode}`
  }

  const initAuth = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    userDisplayName,
    isAdmin,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    initAuth,
  }
}
