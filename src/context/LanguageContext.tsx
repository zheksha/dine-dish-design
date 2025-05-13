
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ru' | 'ky' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Dashboard
    dashboard: 'Dashboard',
    manageYourRestaurant: 'Manage your restaurant, menu items, and special deals.',
    menuItems: 'Menu Items',
    categories: 'Categories',
    totalDeals: 'Total Deals',
    restaurant: 'Restaurant',
    available: 'available',
    unavailable: 'unavailable',
    activeDeals: 'active deals',
    restaurantDetails: 'Restaurant Details',
    updateProfile: 'Update your restaurant profile, contact info, and branding.',
    manageRestaurant: 'Manage Restaurant',
    menuManagement: 'Menu Management',
    manageMenu: 'Manage Menu',
    dealsPromotions: 'Deals & Promotions',
    manageDeals: 'Manage Deals',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    register: 'Register',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    adminPortal: 'Admin Portal',
    logout: 'Logout',
    
    // Menu
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    name: 'Name',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    addMenuItem: 'Add Menu Item',
    editMenuItem: 'Edit Menu Item',
    deleteMenuItem: 'Delete Menu Item',
    description: 'Description',
    price: 'Price',
    type: 'Type',
    vegetarian: 'Vegetarian',
    nonVegetarian: 'Non-Vegetarian',
    ingredients: 'Ingredients',
    separateByCommas: 'Separate by commas',
    tags: 'Tags',
    image: 'Image',
    availability: 'Availability',
    category: 'Category',
    
    // General
    backToMenu: 'Back to Menu',
    theme: 'Theme',
  },
  ru: {
    // Dashboard
    dashboard: 'Панель управления',
    manageYourRestaurant: 'Управляйте вашим рестораном, пунктами меню и специальными предложениями.',
    menuItems: 'Пункты меню',
    categories: 'Категории',
    totalDeals: 'Всего предложений',
    restaurant: 'Ресторан',
    available: 'доступно',
    unavailable: 'недоступно',
    activeDeals: 'активных предложений',
    restaurantDetails: 'Детали ресторана',
    updateProfile: 'Обновите профиль вашего ресторана, контактную информацию и брендинг.',
    manageRestaurant: 'Управление рестораном',
    menuManagement: 'Управление меню',
    manageMenu: 'Управление меню',
    dealsPromotions: 'Акции и предложения',
    manageDeals: 'Управление акциями',
    
    // Auth
    signIn: 'Вход',
    signUp: 'Регистрация',
    email: 'Электронная почта',
    password: 'Пароль',
    login: 'Войти',
    register: 'Зарегистрироваться',
    forgotPassword: 'Забыли пароль?',
    noAccount: 'Нет аккаунта?',
    haveAccount: 'Уже есть аккаунт?',
    adminPortal: 'Панель администратора',
    logout: 'Выйти',
    
    // Menu
    addCategory: 'Добавить категорию',
    editCategory: 'Редактировать категорию',
    deleteCategory: 'Удалить категорию',
    name: 'Название',
    save: 'Сохранить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    addMenuItem: 'Добавить пункт меню',
    editMenuItem: 'Редактировать пункт меню',
    deleteMenuItem: 'Удалить пункт меню',
    description: 'Описание',
    price: 'Цена',
    type: 'Тип',
    vegetarian: 'Вегетарианское',
    nonVegetarian: 'Не вегетарианское',
    ingredients: 'Ингредиенты',
    separateByCommas: 'Разделять запятыми',
    tags: 'Теги',
    image: 'Изображение',
    availability: 'Доступность',
    category: 'Категория',
    
    // General
    backToMenu: 'Вернуться в меню',
    theme: 'Тема',
  },
  ky: {
    // Dashboard
    dashboard: 'Башкаруу панели',
    manageYourRestaurant: 'Рестораныңызды, меню элементтерин жана атайын сунуштарды башкаруу.',
    menuItems: 'Меню элементтери',
    categories: 'Категориялар',
    totalDeals: 'Бардык сунуштар',
    restaurant: 'Ресторан',
    available: 'жеткиликтүү',
    unavailable: 'жеткиликсиз',
    activeDeals: 'активдүү сунуштар',
    restaurantDetails: 'Ресторан жөнүндө',
    updateProfile: 'Рестораныңыздын профилин, байланыш маалыматын жана брендин жаңыртыңыз.',
    manageRestaurant: 'Ресторанды башкаруу',
    menuManagement: 'Меню башкаруу',
    manageMenu: 'Меню башкаруу',
    dealsPromotions: 'Акциялар жана сунуштар',
    manageDeals: 'Акцияларды башкаруу',
    
    // Auth
    signIn: 'Кирүү',
    signUp: 'Катталуу',
    email: 'Электрондук почта',
    password: 'Сырсөз',
    login: 'Кирүү',
    register: 'Катталуу',
    forgotPassword: 'Сырсөздү унуттуңузбу?',
    noAccount: 'Аккаунтуңуз жокпу?',
    haveAccount: 'Аккаунтуңуз барбы?',
    adminPortal: 'Админ панели',
    logout: 'Чыгуу',
    
    // Menu
    addCategory: 'Категория кошуу',
    editCategory: 'Категорияны түзөтүү',
    deleteCategory: 'Категорияны өчүрүү',
    name: 'Аты',
    save: 'Сактоо',
    cancel: 'Жокко чыгаруу',
    confirm: 'Ырастоо',
    addMenuItem: 'Меню элементин кошуу',
    editMenuItem: 'Меню элементин түзөтүү',
    deleteMenuItem: 'Меню элементин өчүрүү',
    description: 'Сүрөттөмө',
    price: 'Баасы',
    type: 'Түрү',
    vegetarian: 'Вегетариандык',
    nonVegetarian: 'Вегетариандык эмес',
    ingredients: 'Ингредиенттер',
    separateByCommas: 'Үтүрлөр менен бөлүү',
    tags: 'Тегдер',
    image: 'Сүрөт',
    availability: 'Жеткиликтүүлүк',
    category: 'Категория',
    
    // General
    backToMenu: 'Менюга кайтуу',
    theme: 'Тема',
  },
  es: {
    // Dashboard
    dashboard: 'Panel de control',
    manageYourRestaurant: 'Administre su restaurante, elementos del menú y ofertas especiales.',
    menuItems: 'Elementos del menú',
    categories: 'Categorías',
    totalDeals: 'Total de ofertas',
    restaurant: 'Restaurante',
    available: 'disponible',
    unavailable: 'no disponible',
    activeDeals: 'ofertas activas',
    restaurantDetails: 'Detalles del restaurante',
    updateProfile: 'Actualice el perfil de su restaurante, información de contacto y marca.',
    manageRestaurant: 'Administrar restaurante',
    menuManagement: 'Gestión de menú',
    manageMenu: 'Administrar menú',
    dealsPromotions: 'Ofertas y promociones',
    manageDeals: 'Administrar ofertas',
    
    // Auth
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    forgotPassword: '¿Olvidó su contraseña?',
    noAccount: '¿No tiene una cuenta?',
    haveAccount: '¿Ya tiene una cuenta?',
    adminPortal: 'Portal de administrador',
    logout: 'Cerrar sesión',
    
    // Menu
    addCategory: 'Agregar categoría',
    editCategory: 'Editar categoría',
    deleteCategory: 'Eliminar categoría',
    name: 'Nombre',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    addMenuItem: 'Agregar elemento de menú',
    editMenuItem: 'Editar elemento de menú',
    deleteMenuItem: 'Eliminar elemento de menú',
    description: 'Descripción',
    price: 'Precio',
    type: 'Tipo',
    vegetarian: 'Vegetariano',
    nonVegetarian: 'No vegetariano',
    ingredients: 'Ingredientes',
    separateByCommas: 'Separar por comas',
    tags: 'Etiquetas',
    image: 'Imagen',
    availability: 'Disponibilidad',
    category: 'Categoría',
    
    // General
    backToMenu: 'Volver al menú',
    theme: 'Tema',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ru', 'ky', 'es'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const translate = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
