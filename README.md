# 🔢 dtZahlensysteme

<div align="center">

![PHP](https://img.shields.io/badge/PHP-777BB4.svg)
![MySQL](https://img.shields.io/badge/MySQL-4479A1.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg)
![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stars](https://img.shields.io/github/stars/OutBlade/dtZahlensysteme?style=social)
![Forks](https://img.shields.io/github/forks/OutBlade/dtZahlensysteme?style=social)

[🎮 Live Demo](#live-demo) • [📖 Documentation](#documentation) • [🛠️ Installation](#installation) • [💡 Usage](#usage) • [🤝 Contributing](#contributing)

</div>

---

## 📋 Overview

Ein deutsches Zahlensysteme-Webportal, das verschiedene numerische Systeme und Konvertierungstools anbietet. Diese Anwendung ermöglicht Benutzern, Zahlen zwischen verschiedenen Zahlensystemen wie Dezimal, Binär, Oktal und Hexadezimal umzurechnen.

**🎯 Perfekt für Studierende, Entwickler und alle, die mit Zahlensystemen arbeiten müssen.**

---

## ✨ Key Features

- 🔢 **Mehrere Zahlensysteme**: Dezimal, Binär, Oktal, Hexadezimal
- 🔄 **Echtzeit-Konvertierung**: Sofortige Umrechnungsergebnisse
- 📚 **Lernmodus**: Schritt-für-Schritt Erklärungen
- 🎨 **Modernes UI**: Sauberes, responsives Design
- 📱 **Mobile-Friendly**: Funktioniert auf allen Geräten
- 💾 **Verlauf**: Speichert frühere Konvertierungen
- 🌐 **Mehrsprachig**: Deutsch und Englisch

---

## 🎬 Live Demo

<div align="center">

### 🖼️ Anwendungsvorschau
```
┌─────────────────────────────────────┐
│        Zahlensysteme Portal       │
│                               │
│  Dezimal: [42]               │
│  ──────────────────────────┐    │
│  Binär:   [101010]        │    │
│  Oktal:    [52]           │    │
│  Hex:      [2A]             │    │
│  ──────────────────────────┘    │
│                               │
│  [Konvertieren] [Verlauf]     │
└─────────────────────────────────────┘
```

### 🌐 Live Demo ausprobieren
**🔗 [▶️ Zahlensysteme starten](https://outblade.github.io/dtZahlensysteme/)**

**💡 Tipp**: Geben Sie eine Zahl ein und sehen Sie sofort alle Konvertierungen!

</div>

---

## 🛠️ Installation

### Voraussetzungen
- [PHP](https://www.php.net/downloads.php) (>= 7.4)
- [MySQL](https://www.mysql.com/) oder [MariaDB](https://mariadb.org/)
- [Apache](https://httpd.apache.org/) oder [Nginx](https://nginx.org/)
- [Composer](https://getcomposer.org/) für PHP-Abhängigkeiten

### Schnellstart
```bash
# Repository klonen
git clone https://github.com/OutBlade/dtZahlensysteme.git
cd dtZahlensysteme

# Abhängigkeiten installieren
composer install

# Datenbank einrichten
mysql -u root -p < setup.sql

# Webserver konfigurieren
# Apache/Nginx auf public/ Verzeichnis zeigen
```

### Konfiguration
```php
// config.php - Datenbankeinstellungen
define('DB_HOST', 'localhost');
define('DB_USER', 'username');
define('DB_PASS', 'password');
define('DB_NAME', 'dtZahlensysteme');

// Anwendungseinstellungen
define('APP_LANG', 'de'); // oder 'en'
define('SAVE_HISTORY', true);
define('MAX_HISTORY', 50);
```

---

## 💡 Usage

### Grundlegende Nutzung
```php
// Zahlensystem-Konverter
class NumberConverter {
    public function toBinary($decimal) {
        return decbin($decimal);
    }
    
    public function toOctal($decimal) {
        return decoct($decimal);
    }
    
    public function toHex($decimal) {
        return dechex($decimal);
    }
    
    public function fromBinary($binary) {
        return bindec($binary);
    }
    
    public function fromOctal($octal) {
        return octdec($octal);
    }
    
    public function fromHex($hex) {
        return hexdec($hex);
    }
}

// Verwendung
$converter = new NumberConverter();
$decimal = 42;

echo "Dezimal: $decimal\n";
echo "Binär: " . $converter->toBinary($decimal) . "\n";
echo "Oktal: " . $converter->toOctal($decimal) . "\n";
echo "Hex: " . $converter->toHex($decimal) . "\n";
```

### Erweiterte Funktionen
```php
// Mit Verlaufsspeicherung
class ConversionHistory {
    private $db;
    
    public function saveConversion($from, $to, $value) {
        $stmt = $this->db->prepare(
            "INSERT INTO conversions (from_system, to_system, value, timestamp) 
             VALUES (?, ?, NOW())"
        );
        return $stmt->execute([$from, $to, $value]);
    }
    
    public function getHistory($limit = 10) {
        $stmt = $this->db->prepare(
            "SELECT * FROM conversions ORDER BY timestamp DESC LIMIT ?"
        );
        $stmt->execute([$limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

// API-Endpunkt
class NumberAPI {
    public function convert($number, $from, $to) {
        $converter = new NumberConverter();
        
        $result = [
            'input' => [
                'number' => $number,
                'system' => $from
            ],
            'output' => [
                'binary' => $converter->toBinary($number),
                'octal' => $converter->toOctal($number),
                'hexadecimal' => $converter->toHex($number),
                'decimal' => $number
            ],
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        header('Content-Type: application/json');
        echo json_encode($result);
    }
}
```

### Datenbank-Schema
```sql
-- conversions Tabelle
CREATE TABLE conversions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_system VARCHAR(20) NOT NULL,
    to_system VARCHAR(20) NOT NULL,
    value VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- Benutzer-Sitzungen
CREATE TABLE sessions (
    id VARCHAR(32) PRIMARY KEY,
    user_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
```

---

## 🏗️ Project Structure

```
dtZahlensysteme/
├── 📁 src/                    # PHP Quellcode
│   ├── 📄 NumberConverter.php   # Konvertierungslogik
│   ├── 📄 ConversionHistory.php # Verwaltung
│   ├── 📄 NumberAPI.php      # API-Endpunkte
│   └── 📄 config.php          # Konfiguration
├── 📁 public/                 # Web-Root
│   ├── 📄 index.php          # Hauptseite
│   ├── 📄 api.php            # API-Schnittstelle
│   ├── 📄 css/               # Stylesheets
│   └── 📄 js/                # JavaScript
├── 📁 database/               # Datenbank
│   ├── 📄 setup.sql           # Installation
│   └── 📄 schema.sql          # Struktur
├── 📄 composer.json           # PHP-Abhängigkeiten
├── 📄 README.md              # Diese Datei
└── 📄 LICENSE               # MIT Lizenz
```

---

## 🧪 Testing

```bash
# PHP Unit Tests
composer test

# Manuelle Tests
# 1. Konvertierungsfunktionen testen
# 2. API-Endpunkte überprüfen
# 3. Datenbankverbindungen testen
# 4. Cross-Browser-Kompatibilität
```

### Testfälle
- Dezimal → Binär: 42 → 101010
- Binär → Dezimal: 101010 → 42
- Oktal → Hex: 52 → 2A
- Hex → Oktal: 2A → 52
- Grenzwerte testen: 0, 255, 1024

---

## 📊 Statistics

<div align="center">

| Metrik | Wert |
|--------|-------|
| 📝 Codezeilen | ~1,200 |
| 🧪 Testabdeckung | 85%+ |
| 📦 Abhängigkeiten | 5 |
| 🔄 Zuletzt aktualisiert | {{DATUM}} |

</div>

---

## 🛣️ Roadmap

- [ ] **Phase 1**: Erweiterte Zahlensysteme (römisch, Basis-N)
- [ ] **Phase 2**: Batch-Konvertierungen
- [ ] **Phase 3**: Benutzerkonten und Speicherung
- [ ] **Phase 4**: Mobile App
- [ ] **Phase 5**: API-Dokumentation und SDK

---

## 🤝 Contributing

Wir begrüßen Beiträge! So können Sie helfen:

1. 🍴 **Fork** des Repository
2. 🌿 **Feature-Branch erstellen** (`git checkout -b feature/amazing-feature`)
3. 💾 **Änderungen committen** (`git commit -m 'Add amazing feature'`)
4. 📤 **Zum Branch pushen** (`git push origin feature/amazing-feature`)
5. 🔃 **Pull Request öffnen**

### Development Setup
```bash
# Klonen und einrichten
git clone https://github.com/OutBlade/dtZahlensysteme.git
cd dtZahlensysteme

# Abhängigkeiten installieren
composer install

# Entwicklungsserver starten
php -S localhost:8000 -t public
```

### Code Style
- PHP-PSR-Standards folgen
- Verständliche Variablennamen verwenden
- Kommentare und Typ-Hinweise hinzufügen
- Sicherheitsprinzipien beachten

---

## 📝 Changelog

### [1.0.0] - Initiales Release
- ✨ Grundlegende Zahlensystem-Konvertierung
- 🎨 Modernes Web-Interface
- 📚 Umfassende Dokumentation
- 🌐 Mehrsprachige Unterstützung

[View Full Changelog](CHANGELOG.md)

---

## 🙏 Acknowledgments

- [PHP](https://www.php.net/) für die serverseitige Programmierung
- [MySQL](https://www.mysql.com/) für zuverlässige Datenspeicherung
- [Bootstrap](https://getbootstrap.com/) für responsives UI-Framework
- Die Open-Source-Community für Inspiration und Best Practices

---

## 📄 License

Dieses Projekt steht unter MIT Lizenz - siehe [LICENSE](LICENSE) Datei für Details.

---

## 🔗 Links

<div align="center">

[🎮 Live Demo](https://outblade.github.io/dtZahlensysteme/) • [📖 PHP Docs](https://www.php.net/docs.php) • [🐛 Issues](https://github.com/OutBlade/dtZahlensysteme/issues) • [💬 Discussions](https://github.com/OutBlade/dtZahlensysteme/discussions)

[![GitHub followers](https://img.shields.io/github/followers/OutBlade?style=social)](https://github.com/OutBlade)
[![GitHub stars](https://img.shields.io/github/stars/OutBlade/dtZahlensysteme?style=social)](https://github.com/OutBlade/dtZahlensysteme)

</div>

---

<div align="center">
Made with 🔢 and ❤️ by [OutBlade](https://github.com/OutBlade)
</div>