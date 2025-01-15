import { create } from "zustand";

const useChatStore = create((set) => ({
  contacts: [],

  addContacts: (newContacts) =>
    set((state) => ({ contacts: [...newContacts, ...state.contacts] })),
  
  setContacts: (contactList) => set({ contacts: [...contactList] }),
}));

export default useChatStore;
