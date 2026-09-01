// Doce Fuego — script principal
// Troque o número abaixo pelo WhatsApp real da loja, com DDI + DDD + número.
const whatsappNumber = "5579999999999";
const defaultWhatsappMessage = "Olá! Conheci a Doce Fuego pelo site e gostaria de tirar uma dúvida sobre os produtos. 💜";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function buildWhatsappUrl(message = defaultWhatsappMessage) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function configureWhatsappLinks() {
  $$(".js-whatsapp").forEach((link) => {
    link.href = buildWhatsappUrl();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
  $$(".js-product-whatsapp").forEach((button) => {
    button.addEventListener("click", () => {
      const product = button.dataset.product || "um produto";
      const message = `Olá! Conheci a Doce Fuego pelo site e gostaria de saber mais sobre ${product}. 💜`;
      window.open(buildWhatsappUrl(message), "_blank", "noopener,noreferrer");
    });
  });
}

function setupAgeGate() {
  const gate = $("#ageGate"); const confirm = $("#ageConfirm"); const exit = $("#ageExit");
  if (!gate || !confirm || !exit) return;
  const accepted = sessionStorage.getItem("doceFuegoAgeAccepted") === "true";
  if (accepted) { gate.hidden = true; document.body.classList.remove("age-locked"); }
  else { gate.hidden = false; document.body.classList.add("age-locked"); }
  confirm.addEventListener("click", () => { sessionStorage.setItem("doceFuegoAgeAccepted", "true"); gate.hidden = true; document.body.classList.remove("age-locked"); });
  exit.addEventListener("click", () => { if (window.history.length > 1) window.history.back(); else window.location.replace("about:blank"); });
}

function setupMobileMenu() {
  const toggle = $("#menuToggle"); const nav = $("#mainNav"); if (!toggle || !nav) return;
  const closeMenu = () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Abrir menu"); };
  toggle.addEventListener("click", () => { const isOpen = nav.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", String(isOpen)); toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu"); });
  $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 980) closeMenu(); });
}

function setupHeader() {
  const header = $(".site-header"); if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  update(); window.addEventListener("scroll", update, { passive: true });
}

function setActiveFilter(filter) {
  $$(".filter-btn").forEach((button) => { const active = button.dataset.filter === filter; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
  $$(".product-card").forEach((card) => { const visible = filter === "todos" || card.dataset.category === filter; card.classList.toggle("is-hidden", !visible); card.setAttribute("aria-hidden", String(!visible)); });
}

function setupProductFilters() {
  $$(".filter-btn").forEach((button) => button.addEventListener("click", () => setActiveFilter(button.dataset.filter || "todos")));
  $$('[data-filter-jump]').forEach((button) => button.addEventListener("click", () => { setActiveFilter(button.dataset.filterJump || "todos"); $("#produtos")?.scrollIntoView({ behavior: "smooth", block: "start" }); }));
}

function setupFaq() {
  $$(".faq-question").forEach((question) => question.addEventListener("click", () => {
    const item = question.closest(".faq-item"); if (!item) return; const willOpen = !item.classList.contains("is-open");
    $$(".faq-item").forEach((other) => { other.classList.remove("is-open"); $(".faq-question", other)?.setAttribute("aria-expanded", "false"); });
    if (willOpen) { item.classList.add("is-open"); question.setAttribute("aria-expanded", "true"); }
  }));
}

const guides = {
  primeiro:{eyebrow:"GUIA INTRODUTÓRIO",title:"Como escolher seu primeiro produto?",body:`<p>Comece pelo que você deseja melhorar na experiência: conforto, autocuidado, conexão ou curiosidade. Prefira produtos com descrição clara, materiais identificados e instruções do fabricante.</p><ul><li>Leia indicação de uso, composição e cuidados.</li><li>Comece por opções simples e adequadas ao seu objetivo.</li><li>Respeite seus limites e interrompa o uso em caso de desconforto.</li><li>Na dúvida, procure orientação profissional de saúde para questões médicas.</li></ul>`},
  higiene:{eyebrow:"CUIDADO & CONSERVAÇÃO",title:"Como cuidar e higienizar?",body:`<p>A higienização depende do material e das instruções de cada fabricante. Como regra geral, mantenha os itens limpos, secos e armazenados separadamente.</p><ul><li>Siga sempre o rótulo e o manual do produto.</li><li>Evite produtos de limpeza não recomendados pelo fabricante.</li><li>Seque completamente antes de guardar.</li><li>Não compartilhe itens de uso pessoal sem orientação adequada de higiene e proteção.</li></ul>`},
  lubrificantes:{eyebrow:"ESCOLHA INFORMADA",title:"Lubrificantes: como escolher?",body:`<p>Existem diferentes bases e formulações. A escolha deve considerar conforto, compatibilidade com outros produtos e as informações do fabricante.</p><ul><li>Confira ingredientes e eventuais sensibilidades.</li><li>Verifique compatibilidade com preservativos e acessórios.</li><li>Use apenas conforme a finalidade indicada no rótulo.</li><li>Em caso de irritação persistente, suspenda o uso e procure orientação de saúde.</li></ul>`},
  conversa:{eyebrow:"CONEXÃO & RESPEITO",title:"Como conversar sobre desejos?",body:`<p>Uma boa conversa começa sem pressão. Fale sobre curiosidades, limites e preferências de forma respeitosa, dando espaço real para a outra pessoa responder.</p><ul><li>Consentimento precisa ser claro, livre e pode mudar a qualquer momento.</li><li>Evite insistência, cobrança ou constrangimento.</li><li>Conversem sobre limites antes de experimentar algo novo.</li><li>Priorize confiança, conforto e comunicação durante toda a experiência.</li></ul>`}
};
const legalContent = {
  privacy:{eyebrow:"MODELO DEMONSTRATIVO",title:"Política de Privacidade",body:`<p>Esta página é uma demonstração de portfólio. Antes de uma operação comercial real, substitua este texto por uma política revisada para o negócio e compatível com a legislação aplicável.</p><p>A proposta da Doce Fuego é coletar apenas dados necessários para atendimento, pagamento e entrega, evitando informações íntimas desnecessárias.</p>`},
  delivery:{eyebrow:"MODELO DEMONSTRATIVO",title:"Política de Entrega",body:`<p>Defina regiões atendidas, prazos, transportadoras, custos de frete, procedimentos em caso de atraso e regras para embalagem discreta antes de publicar comercialmente.</p>`},
  exchange:{eyebrow:"MODELO DEMONSTRATIVO",title:"Política de Troca",body:`<p>Produtos de uso íntimo podem ter regras específicas por higiene e segurança. A política real deve informar claramente as condições aplicáveis e respeitar os direitos do consumidor.</p>`},
  terms:{eyebrow:"MODELO DEMONSTRATIVO",title:"Termos de Uso",body:`<p>O conteúdo desta versão é demonstrativo. Produtos, preços, depoimentos e políticas devem ser validados e substituídos por informações reais antes do uso comercial. O acesso é destinado a maiores de 18 anos.</p>`}
};

function setupContentModal() {
  const modal=$("#contentModal"), title=$("#modalTitle"), eyebrow=$("#modalEyebrow"), body=$("#modalBody"); if(!modal||!title||!eyebrow||!body)return;
  let lastFocused=null;
  const openModal=(content)=>{if(!content)return;lastFocused=document.activeElement;eyebrow.textContent=content.eyebrow;title.textContent=content.title;body.innerHTML=content.body;modal.hidden=false;document.body.style.overflow="hidden";$(".content-modal__close",modal)?.focus();};
  const closeModal=()=>{modal.hidden=true;document.body.style.overflow="";if(lastFocused instanceof HTMLElement)lastFocused.focus();};
  $$(".js-guide").forEach((button)=>button.addEventListener("click",()=>openModal(guides[button.dataset.guide])));
  $$(".js-legal").forEach((button)=>button.addEventListener("click",()=>openModal(legalContent[button.dataset.legal])));
  $$('[data-modal-close]',modal).forEach((el)=>el.addEventListener("click",closeModal));
  document.addEventListener("keydown",(event)=>{if(event.key==="Escape"&&!modal.hidden)closeModal();});
}

function setupRevealAnimations() {
  const items=$$(".reveal");
  if (!("IntersectionObserver" in window)) {items.forEach((item)=>item.classList.add("is-visible"));return;}
  const observer=new IntersectionObserver((entries,obs)=>entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");obs.unobserve(entry.target);}}),{threshold:.12,rootMargin:"0px 0px -30px"});
  items.forEach((item)=>observer.observe(item));
}
function setCurrentYear(){const year=$("#currentYear");if(year)year.textContent=new Date().getFullYear();}

document.addEventListener("DOMContentLoaded",()=>{configureWhatsappLinks();setupAgeGate();setupMobileMenu();setupHeader();setupProductFilters();setupFaq();setupContentModal();setupRevealAnimations();setCurrentYear();});
