import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  UserCredential
} from 'firebase/auth'
import {auth} from '../firebase'

export const createUser = (email: string, password: string):Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
}

export const loginUser = (email: string, password: string):Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
}

export const signOut = ():Promise<void> => {
  return auth.signOut();
}