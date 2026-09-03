// Identificador único curto para nós, ligações e formas.
export const uid = () => `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
