// Demo accounts for quick testing
// Note: You can create your own accounts through the signup form

export const DEMO_ACCOUNTS = {
  student: {
    username: 'student1',
    password: 'demo123',
    name: 'Ali',
    role: 'student' as const
  },
  teacher: {
    username: 'teacher1',
    password: 'demo123',
    name: 'Öğretmen Ayşe',
    role: 'teacher' as const
  }
};

export const DEMO_INFO = {
  tr: {
    title: 'Demo Hesapları',
    description: 'Hızlı test için demo hesaplarını kullanabilirsiniz',
    student: 'Öğrenci Hesabı',
    teacher: 'Öğretmen Hesabı',
    username: 'Kullanıcı Adı',
    password: 'Şifre',
    note: 'Not: Kendi hesabınızı da oluşturabilirsiniz!'
  },
  nl: {
    title: 'Demo Accounts',
    description: 'Je kunt demo accounts gebruiken voor snelle tests',
    student: 'Student Account',
    teacher: 'Leraar Account',
    username: 'Gebruikersnaam',
    password: 'Wachtwoord',
    note: 'Opmerking: Je kunt ook je eigen account aanmaken!'
  }
};
