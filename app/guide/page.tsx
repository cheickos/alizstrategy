'use client';

import { useState } from 'react';
import { Download, BookOpen, Code, Rocket, Users, Shield, Zap } from 'lucide-react';

export default function GuidePage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      // Récupérer le fichier depuis le dossier public
      const response = await fetch('/GUIDE_DEVELOPPEMENT_SITE.md');
      const text = await response.text();
      
      // Créer un blob et télécharger
      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'GUIDE_DEVELOPPEMENT_SITE.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Message de succès
      setTimeout(() => {
        setDownloading(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      setDownloading(false);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    }
  };

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Code Complet",
      description: "Exemples de code prêts à l'emploi"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Démarrage Rapide",
      description: "Guide pas à pas pour débutants"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bonnes Pratiques",
      description: "Sécurité et performance optimales"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Messages Types",
      description: "Communications avec Claude AI"
    }
  ];

  const contents = [
    "✅ Architecture complète Backend/Frontend",
    "✅ Tableau de bord administrateur",
    "✅ Système d'upload de fichiers",
    "✅ Authentification sécurisée",
    "✅ Messages types pour Claude AI",
    "✅ Guide d'installation détaillé",
    "✅ Résolution des problèmes courants",
    "✅ Checklist de lancement production"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Guide de Développement
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Apprenez à créer un site web professionnel complet avec backend, 
            frontend et tableau de bord administrateur en suivant mes conversations avec Claude AI
          </p>
          
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-75"
          >
            <Download className={`w-6 h-6 ${downloading ? 'animate-bounce' : ''}`} />
            {downloading ? 'Téléchargement en cours...' : 'Télécharger le Guide Complet'}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">5</div>
              <div className="text-gray-600 mt-2">Étapes Clés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">15+</div>
              <div className="text-gray-600 mt-2">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">100%</div>
              <div className="text-gray-600 mt-2">Pratique</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">0€</div>
              <div className="text-gray-600 mt-2">Gratuit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Ce que vous allez apprendre
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contenu du Guide
              </h2>
              <div className="space-y-3">
                {contents.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-lg text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <Zap className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Prêt à commencer ?
                </h3>
                <p className="text-gray-600 mb-6">
                  Téléchargez le guide complet et commencez à créer votre site web professionnel dès aujourd'hui.
                </p>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  {downloading ? '⏳ Téléchargement...' : '📥 Télécharger Maintenant'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Technologies Couvertes
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {['Next.js 15', 'React', 'TypeScript', 'Tailwind CSS', 'Express.js', 'Node.js', 'Nodemailer', 'Chart.js', 'AOS'].map((tech) => (
            <span
              key={tech}
              className="bg-white px-6 py-3 rounded-full shadow-md text-gray-700 font-medium hover:shadow-lg transition-shadow"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Commencez votre projet aujourd'hui
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Guide complet avec exemples de code, messages types pour Claude AI, 
            et checklist de lancement production.
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <Download className="w-6 h-6" />
            Télécharger Gratuitement
          </button>
        </div>
      </div>
    </div>
  );
}