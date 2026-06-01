export interface ComponentSpec {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'controller' | 'sensor' | 'actuator' | 'power' | 'wiring_proto' | 'tool';
  quantity: number;
  specsAr: string[];
  specsEn: string[];
  originAr: string;
  originEn: string;
  principleAr: string;
  principleEn: string;
  imagePlaceholder: string;
}

export interface NodeData {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  roleAr: string;
  roleEn: string;
  gpioPins: {
    pin: string;
    targetAr: string;
    targetEn: string;
    protocol: string;
  }[];
}

export interface QuizQuestion {
  id: number;
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctAnswerIndex: number;
  explanationAr: string;
  explanationEn: string;
}

export interface WiringConnection {
  id: string;
  from: string;
  to: string;
  color: string;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
}
