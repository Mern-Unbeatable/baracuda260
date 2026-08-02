/**
 * One-shot merge of legal + leftover UI i18n keys into en.json / pl.json.
 * Run: node scripts/merge-legal-i18n.js
 */
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');

const enExtra = {
  common: {
    categories: {
      Nature: 'Nature',
      Portrait: 'Portrait',
      Wildlife: 'Wildlife',
      Landscape: 'Landscape',
      'Street Photography': 'Street Photography',
      Architecture: 'Architecture',
      'Black & White': 'Black & White',
      Travel: 'Travel',
      Wedding: 'Wedding',
      Macro: 'Macro',
      'Fine Art': 'Fine Art',
      Pets: 'Pets',
      Sports: 'Sports',
      'Night Photography': 'Night Photography',
    },
    badges: {
      singlePhoto: 'Single Photo',
      sixPhotosStory: '6 PHOTOS STORY',
      twelveZodiacFull: '12 Photos - Full Zodiac Story',
      twelvePhotoZodiac: '12 Photo Zodiac',
      firstPlace: '1st PLACE',
      secondPlace: '2nd PLACE',
      thirdPlace: '3rd PLACE',
      popularVote: 'Popular Vote',
      topRated: 'Top Rated',
      editorsChoice: "Editor's Choice",
    },
    themeSilentStreets: 'THEME: SILENT STREETS',
    categorySingleShort: 'Cat : Single Short',
  },
  home: {
    testimonials: {
      a1quote:
        'Thanks to My12Photos, my work reached thousands of people. This is the best photography community I have ever been part of.',
      a1role: 'July 2025 Winner',
      a2quote:
        'The platform is incredibly clean and elegant. Voting is a pleasure, and the prizes genuinely motivate you to push your craft.',
      a2role: 'Top 3 — June 2025',
      a3quote:
        'I received more meaningful feedback here than on every other platform combined. I recommend it to every photographer.',
      a3role: 'Zodiac Album Winner',
    },
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: July 2026',
    sections: [
      {
        id: 'introduction',
        title: '1. Introduction',
        paragraphs: [
          'Welcome to My12Photos. Protecting your privacy is one of our highest priorities. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our photography competition platform.',
        ],
      },
      {
        id: 'collect',
        title: '2. Information We Collect',
        lead: 'We may collect the following information:',
        bullets: [
          'Full Name',
          'Email Address',
          'Profile Information',
          'Uploaded Photos and Albums',
          'Competition Participation Data',
          'Voting Activity',
          'Device and Browser Information',
          'IP Address',
          'Cookies and Analytics Data',
        ],
      },
      {
        id: 'use',
        title: '3. How We Use Your Information',
        lead: 'Your information is used to:',
        bullets: [
          'Create and manage your account',
          'Allow participation in photography competitions',
          'Display your submitted entries',
          'Process winner verification and prize payments',
          'Send newsletters and competition updates',
          'Improve website performance and user experience',
          'Prevent fraud and abuse',
        ],
      },
      {
        id: 'ownership',
        title: '4. Photo Ownership',
        paragraphs: [
          'You retain full ownership of every image you upload.',
          'By submitting photos to My12Photos, you grant us a non-exclusive license to display your images within competitions, galleries, promotional materials, and winner announcements.',
        ],
      },
      {
        id: 'payments',
        title: '5. Prize Payments',
        paragraphs: [
          'If you become a winner, we may collect additional payment information, such as your PayPal email address, solely for prize distribution.',
        ],
      },
      {
        id: 'security',
        title: '6. Data Security',
        paragraphs: [
          'We use industry-standard security measures to protect your personal information from unauthorized access, disclosure, or misuse.',
        ],
      },
      {
        id: 'third-party',
        title: '7. Third-Party Services',
        lead: 'Our platform may use trusted third-party services including:',
        bullets: ['Google Analytics', 'Google Ads', 'PayPal', 'Email Service Providers'],
        footnotes: ['Each service has its own privacy policy.'],
      },
      {
        id: 'rights',
        title: '8. Your Rights',
        lead: 'You may:',
        bullets: [
          'Access your personal information',
          'Update your profile',
          'Request deletion of your account',
          'Withdraw newsletter subscriptions',
          'Contact us regarding privacy concerns',
        ],
        footnotes: ['Each service has its own privacy policy.'],
      },
      {
        id: 'contact',
        title: '9. Contact',
        paragraphs: [
          'If you have questions regarding this Privacy Policy, please contact us through our Contact page.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'Last Updated: July 2026',
    sections: [
      {
        id: 'introduction',
        title: '1. Introduction',
        paragraphs: [
          'Welcome to My12Photos.',
          'By accessing or using this website, you agree to comply with these Terms of Service.',
        ],
      },
      {
        id: 'eligibility',
        title: '2. Eligibility',
        leads: [
          'You must be at least 18 years old or have permission from a parent or legal guardian.',
        ],
      },
      {
        id: 'accounts',
        title: '3. User Accounts',
        leads: ['Users are responsible for:'],
        bullets: [
          'Maintaining account security',
          'Providing accurate information',
          'Keeping login credentials confidential',
        ],
      },
      {
        id: 'competitions',
        title: '4. Photography Competitions',
        leads: ['Participation is completely free unless otherwise announced.'],
        listIntro: 'Users agree to:',
        bullets: [
          'Upload only original content.',
          'Respect competition rules.',
          'Avoid copyrighted material owned by others.',
          'Refrain from offensive, illegal, or inappropriate content.',
        ],
      },
      {
        id: 'voting',
        title: '5. Voting',
        paragraphs: [
          'The platform reserves the right to remove fraudulent votes or disqualify users engaging in manipulation.',
        ],
      },
      {
        id: 'ip',
        title: '6. Intellectual Property',
        paragraphs: [
          'Users retain ownership of their uploaded photographs.',
          'By participating, users grant My12Photos permission to display submitted images for competition purposes and promotional activities.',
        ],
      },
      {
        id: 'prizes',
        title: '7. Prize Distribution',
        leads: [
          'Cash prizes are distributed through PayPal unless otherwise specified.',
          'Winners may be required to verify their identity before receiving payments.',
        ],
      },
      {
        id: 'prohibited',
        title: '8. Prohibited Activities',
        leads: ['Users must not:'],
        bullets: [
          'Upload illegal content',
          'Impersonate others',
          'Use bots or automated voting',
          'Manipulate rankings',
          'Attempt unauthorized access',
          'Abuse the platform',
        ],
      },
      {
        id: 'suspension',
        title: '9. Account Suspension',
        leads: [
          'We reserve the right to suspend or terminate accounts that violate these Terms.',
        ],
      },
      {
        id: 'disclaimer',
        title: '10. Disclaimer',
        leads: [
          'While we strive to provide uninterrupted service, My12Photos cannot guarantee continuous availability.',
        ],
      },
      {
        id: 'changes',
        title: '11. Changes',
        leads: [
          'We may update these Terms at any time.',
          'Continued use of the platform constitutes acceptance of the updated Terms.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    lastUpdated: 'Last Updated: July 2026',
    intro:
      'This Cookie Policy explains how My12Photos uses cookies to improve your browsing experience.',
    sections: [
      {
        id: 'what-are-cookies',
        title: 'What Are Cookies?',
        leads: [
          'Cookies are small text files stored on your device that help websites remember your preferences and improve functionality.',
        ],
      },
      {
        id: 'types',
        title: 'Types of Cookies We Use',
        leads: ['Required for:'],
        bullets: ['Login', 'Account Security', 'Session Management', 'Language Preferences'],
      },
      {
        id: 'performance',
        title: 'Performance Cookies',
        listIntro: 'Used to:',
        bullets: [
          'Measure website performance',
          'Improve loading speed',
          'Analyze visitor behavior',
        ],
      },
      {
        id: 'analytics',
        title: 'Analytics Cookies',
        leads: ['We use Google Analytics to understand:'],
        bullets: [
          'Visitor traffic',
          'Popular pages',
          'User engagement',
          'Website performance',
        ],
      },
      {
        id: 'advertising',
        title: 'Advertising Cookies',
        leads: [
          'Google Ads may use cookies to display relevant advertisements and measure advertising effectiveness.',
        ],
      },
      {
        id: 'functional',
        title: 'Functional Cookies',
        leads: ['Remember:'],
        bullets: [
          'Selected language',
          'User preferences',
          'Competition filters',
          'Display settings',
        ],
      },
      {
        id: 'managing',
        title: 'Managing Cookies',
        leads: ['Most browsers allow you to:'],
        bullets: [
          'Accept all cookies',
          'Reject cookies',
          'Delete stored cookies',
          'Control cookie preferences',
        ],
      },
      {
        id: 'third-party',
        title: 'Third-Party Cookies',
        leads: ['Some cookies are provided by trusted third-party services including:'],
        bullets: ['Google Analytics', 'Google Ads', 'PayPal'],
      },
      {
        id: 'updates',
        title: 'Updates',
        leads: [
          'We may update this Cookie Policy periodically to reflect changes in technology or legal requirements.',
        ],
      },
    ],
  },
};

const plExtra = {
  common: {
    categories: {
      Nature: 'Natura',
      Portrait: 'Portret',
      Wildlife: 'Dzika przyroda',
      Landscape: 'Krajobraz',
      'Street Photography': 'Fotografia uliczna',
      Architecture: 'Architektura',
      'Black & White': 'Czarno-białe',
      Travel: 'Podróże',
      Wedding: 'Ślub',
      Macro: 'Makro',
      'Fine Art': 'Sztuka',
      Pets: 'Zwierzęta',
      Sports: 'Sport',
      'Night Photography': 'Fotografia nocna',
    },
    badges: {
      singlePhoto: 'Pojedyncze zdjęcie',
      sixPhotosStory: 'HISTORIA 6 ZDJĘĆ',
      twelveZodiacFull: '12 zdjęć — pełna historia zodiaku',
      twelvePhotoZodiac: '12 zdjęć — zodiak',
      firstPlace: '1. MIEJSCE',
      secondPlace: '2. MIEJSCE',
      thirdPlace: '3. MIEJSCE',
      popularVote: 'Głos publiczności',
      topRated: 'Najwyżej oceniane',
      editorsChoice: 'Wybór redakcji',
    },
    themeSilentStreets: 'MOTYW: CICHĘ ULICZKI',
    categorySingleShort: 'Kat. : Single Short',
  },
  home: {
    testimonials: {
      a1quote:
        'Dzięki My12Photos moje prace zobaczyły tysiące osób. To najlepsza społeczność fotograficzna, w jakiej brałem udział.',
      a1role: 'Zwycięzca lipca 2025',
      a2quote:
        'Platforma jest wyjątkowo czysta i elegancka. Głosowanie to przyjemność, a nagrody naprawdę motywują do rozwoju.',
      a2role: 'Top 3 — czerwiec 2025',
      a3quote:
        'Otrzymałem tu więcej wartościowego feedbacku niż na wszystkich innych platformach razem. Polecam każdemu fotografowi.',
      a3role: 'Zwycięzca albumu zodiakalnego',
    },
  },
  privacy: {
    title: 'Polityka prywatności',
    lastUpdated: 'Ostatnia aktualizacja: lipiec 2026',
    sections: [
      {
        id: 'introduction',
        title: '1. Wprowadzenie',
        paragraphs: [
          'Witamy w My12Photos. Ochrona Twojej prywatności jest jednym z naszych najwyższych priorytetów. Niniejsza Polityka prywatności wyjaśnia, jak zbieramy, wykorzystujemy, przechowujemy i chronimy Twoje dane osobowe podczas korzystania z naszej platformy konkursów fotograficznych.',
        ],
      },
      {
        id: 'collect',
        title: '2. Jakie informacje zbieramy',
        lead: 'Możemy zbierać następujące informacje:',
        bullets: [
          'Imię i nazwisko',
          'Adres e-mail',
          'Informacje o profilu',
          'Przesłane zdjęcia i albumy',
          'Dane o udziale w konkursach',
          'Aktywność głosowania',
          'Informacje o urządzeniu i przeglądarce',
          'Adres IP',
          'Pliki cookie i dane analityczne',
        ],
      },
      {
        id: 'use',
        title: '3. Jak wykorzystujemy Twoje informacje',
        lead: 'Twoje informacje są wykorzystywane do:',
        bullets: [
          'Tworzenia i zarządzania kontem',
          'Umożliwienia udziału w konkursach fotograficznych',
          'Wyświetlania zgłoszonych prac',
          'Weryfikacji zwycięzców i wypłaty nagród',
          'Wysyłania newsletterów i aktualizacji konkursów',
          'Poprawy wydajności strony i doświadczenia użytkownika',
          'Zapobiegania oszustwom i nadużyciom',
        ],
      },
      {
        id: 'ownership',
        title: '4. Prawa do zdjęć',
        paragraphs: [
          'Zachowujesz pełne prawa własności do każdego przesłanego zdjęcia.',
          'Przesyłając zdjęcia do My12Photos, udzielasz nam niewyłącznej licencji na wyświetlanie Twoich obrazów w konkursach, galeriach, materiałach promocyjnych oraz ogłoszeniach zwycięzców.',
        ],
      },
      {
        id: 'payments',
        title: '5. Wypłaty nagród',
        paragraphs: [
          'Jeśli zostaniesz zwycięzcą, możemy zebrać dodatkowe dane płatnicze, takie jak adres e-mail PayPal, wyłącznie w celu wypłaty nagrody.',
        ],
      },
      {
        id: 'security',
        title: '6. Bezpieczeństwo danych',
        paragraphs: [
          'Stosujemy standardowe w branży środki bezpieczeństwa, aby chronić Twoje dane osobowe przed nieuprawnionym dostępem, ujawnieniem lub niewłaściwym użyciem.',
        ],
      },
      {
        id: 'third-party',
        title: '7. Usługi zewnętrzne',
        lead: 'Nasza platforma może korzystać z zaufanych usług zewnętrznych, w tym:',
        bullets: ['Google Analytics', 'Google Ads', 'PayPal', 'Dostawcy usług e-mail'],
        footnotes: ['Każda usługa ma własną politykę prywatności.'],
      },
      {
        id: 'rights',
        title: '8. Twoje prawa',
        lead: 'Możesz:',
        bullets: [
          'Uzyskać dostęp do swoich danych osobowych',
          'Zaktualizować profil',
          'Poprosić o usunięcie konta',
          'Zrezygnować z subskrypcji newslettera',
          'Skontaktować się z nami w sprawach prywatności',
        ],
        footnotes: ['Każda usługa ma własną politykę prywatności.'],
      },
      {
        id: 'contact',
        title: '9. Kontakt',
        paragraphs: [
          'Jeśli masz pytania dotyczące niniejszej Polityki prywatności, skontaktuj się z nami przez stronę Kontakt.',
        ],
      },
    ],
  },
  terms: {
    title: 'Regulamin',
    lastUpdated: 'Ostatnia aktualizacja: lipiec 2026',
    sections: [
      {
        id: 'introduction',
        title: '1. Wprowadzenie',
        paragraphs: [
          'Witamy w My12Photos.',
          'Korzystając z tej strony, zgadzasz się przestrzegać niniejszego Regulaminu.',
        ],
      },
      {
        id: 'eligibility',
        title: '2. Warunki udziału',
        leads: [
          'Musisz mieć ukończone 18 lat lub posiadać zgodę rodzica albo opiekuna prawnego.',
        ],
      },
      {
        id: 'accounts',
        title: '3. Konta użytkowników',
        leads: ['Użytkownicy są odpowiedzialni za:'],
        bullets: [
          'Utrzymanie bezpieczeństwa konta',
          'Podawanie prawdziwych informacji',
          'Zachowanie poufności danych logowania',
        ],
      },
      {
        id: 'competitions',
        title: '4. Konkursy fotograficzne',
        leads: ['Udział jest całkowicie bezpłatny, o ile nie ogłoszono inaczej.'],
        listIntro: 'Użytkownicy zobowiązują się do:',
        bullets: [
          'Przesyłania wyłącznie oryginalnych treści.',
          'Przestrzegania zasad konkursu.',
          'Unikania materiałów chronionych prawem autorskim należących do innych.',
          'Powstrzymania się od treści obraźliwych, nielegalnych lub nieodpowiednich.',
        ],
      },
      {
        id: 'voting',
        title: '5. Głosowanie',
        paragraphs: [
          'Platforma zastrzega sobie prawo do usuwania fałszywych głosów lub dyskwalifikacji użytkowników manipulujących wynikami.',
        ],
      },
      {
        id: 'ip',
        title: '6. Własność intelektualna',
        paragraphs: [
          'Użytkownicy zachowują prawa do przesłanych fotografii.',
          'Biorąc udział, użytkownicy udzielają My12Photos zgody na wyświetlanie zgłoszonych obrazów w celach konkursowych i promocyjnych.',
        ],
      },
      {
        id: 'prizes',
        title: '7. Wypłata nagród',
        leads: [
          'Nagrody pieniężne są wypłacane przez PayPal, o ile nie wskazano inaczej.',
          'Zwycięzcy mogą zostać poproszeni o weryfikację tożsamości przed otrzymaniem wypłaty.',
        ],
      },
      {
        id: 'prohibited',
        title: '8. Zabronione działania',
        leads: ['Użytkownicy nie mogą:'],
        bullets: [
          'Przesyłać nielegalnych treści',
          'Podszywać się pod innych',
          'Używać botów ani automatycznego głosowania',
          'Manipulować rankingami',
          'Próbować nieuprawnionego dostępu',
          'Nadużywać platformy',
        ],
      },
      {
        id: 'suspension',
        title: '9. Zawieszenie konta',
        leads: [
          'Zastrzegamy sobie prawo do zawieszenia lub usunięcia kont naruszających niniejszy Regulamin.',
        ],
      },
      {
        id: 'disclaimer',
        title: '10. Zastrzeżenie',
        leads: [
          'Choć dążymy do nieprzerwanej dostępności, My12Photos nie gwarantuje ciągłego działania usługi.',
        ],
      },
      {
        id: 'changes',
        title: '11. Zmiany',
        leads: [
          'Możemy aktualizować niniejszy Regulamin w dowolnym momencie.',
          'Dalsze korzystanie z platformy oznacza akceptację zaktualizowanego Regulaminu.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Polityka plików cookie',
    lastUpdated: 'Ostatnia aktualizacja: lipiec 2026',
    intro:
      'Niniejsza Polityka plików cookie wyjaśnia, w jaki sposób My12Photos używa plików cookie, aby poprawić Twoje doświadczenie przeglądania.',
    sections: [
      {
        id: 'what-are-cookies',
        title: 'Czym są pliki cookie?',
        leads: [
          'Pliki cookie to małe pliki tekstowe przechowywane na Twoim urządzeniu, które pomagają stronom zapamiętywać preferencje i poprawiać działanie.',
        ],
      },
      {
        id: 'types',
        title: 'Rodzaje plików cookie, których używamy',
        leads: ['Wymagane do:'],
        bullets: ['Logowania', 'Bezpieczeństwa konta', 'Zarządzania sesją', 'Preferencji językowych'],
      },
      {
        id: 'performance',
        title: 'Pliki cookie wydajnościowe',
        listIntro: 'Służą do:',
        bullets: [
          'Pomiaru wydajności strony',
          'Poprawy szybkości ładowania',
          'Analizy zachowań odwiedzających',
        ],
      },
      {
        id: 'analytics',
        title: 'Pliki cookie analityczne',
        leads: ['Używamy Google Analytics, aby zrozumieć:'],
        bullets: [
          'Ruch odwiedzających',
          'Popularne strony',
          'Zaangażowanie użytkowników',
          'Wydajność witryny',
        ],
      },
      {
        id: 'advertising',
        title: 'Pliki cookie reklamowe',
        leads: [
          'Google Ads może używać plików cookie do wyświetlania trafnych reklam i pomiaru skuteczności reklam.',
        ],
      },
      {
        id: 'functional',
        title: 'Pliki cookie funkcjonalne',
        leads: ['Zapamiętują:'],
        bullets: [
          'Wybrany język',
          'Preferencje użytkownika',
          'Filtry konkursów',
          'Ustawienia wyświetlania',
        ],
      },
      {
        id: 'managing',
        title: 'Zarządzanie plikami cookie',
        leads: ['Większość przeglądarek pozwala na:'],
        bullets: [
          'Akceptację wszystkich plików cookie',
          'Odrzucenie plików cookie',
          'Usunięcie zapisanych plików cookie',
          'Kontrolę preferencji cookie',
        ],
      },
      {
        id: 'third-party',
        title: 'Pliki cookie stron trzecich',
        leads: ['Niektóre pliki cookie pochodzą z zaufanych usług zewnętrznych, w tym:'],
        bullets: ['Google Analytics', 'Google Ads', 'PayPal'],
      },
      {
        id: 'updates',
        title: 'Aktualizacje',
        leads: [
          'Możemy okresowo aktualizować tę Politykę plików cookie, aby odzwierciedlać zmiany technologiczne lub wymogi prawne.',
        ],
      },
    ],
  },
};

function deepMerge(target, source) {
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

for (const [file, extra] of [
  ['en.json', enExtra],
  ['pl.json', plExtra],
]) {
  const filePath = path.join(localesDir, file);
  const current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const merged = deepMerge(current, extra);
  fs.writeFileSync(filePath, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Updated ${file}`);
}
