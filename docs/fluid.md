Готовые библиотеки для Fluid Design в React/Next.js                                                                                                    
                                                                                                                                                         
  1. tailwind-clamp (Рекомендую для Tailwind v4)                                                                                                         
                                                                                                                                                         
  Установка:                                                                                                                                             
  npm install tailwind-clamp                                                                                                                             
                                                                                                                                                         
  Конфигурация (CSS для Tailwind v4):                                                                                                                    
  @import "tailwindcss";                                                                                                                                 
  @plugin "tailwind-clamp" {                                                                                                                             
    minSize: 25rem;   /* 400px */                                                                                                                        
    maxSize: 80rem;   /* 1280px */                                                                                                                       
  }                                                                                                                                                      
                                                                                                                                                         
  Использование:                                                                                                                                         
  <!-- Fluid typography -->                                                                                                                              
  <h1 class="clamp-[text,lg,3xl]">Заголовок</h1>                                                                                                         
                                                                                                                                                         
  <!-- Fluid padding с пикселями -->                                                                                                                     
  <div class="clamp-[px,20,40] clamp-[py,10,18]">                                                                                                        
    Fluid padding 20px → 40px                                                                                                                            
  </div>                                                                                                                                                 
                                                                                                                                                         
  <!-- Fluid spacing с Tailwind units -->                                                                                                                
  <div class="clamp-[p,1,2]">                                                                                                                            
    Padding 1rem → 2rem                                                                                                                                  
  </div>                                                                                                                                                 
                                                                                                                                                         
  <!-- С Container Queries -->                                                                                                                           
  <div class="@container">                                                                                                                               
    <div class="clamp-[text,lg,3xl,@sm,@5xl]">                                                                                                           
      Масштабируется по контейнеру                                                                                                                       
    </div>                                                                                                                                               
  </div>                                                                                                                                                 
                                                                                                                                                         
  ---                                                                                                                                                    
  2. fluid-tailwindcss (Самый гибкий)                                                                                                                    
                                                                                                                                                         
  Установка:                                                                                                                                             
  npm install fluid-tailwindcss                                                                                                                          
                                                                                                                                                         
  Конфигурация Tailwind v4:                                                                                                                              
  @import "tailwindcss";                                                                                                                                 
  @plugin "fluid-tailwindcss" {                                                                                                                          
    minViewport: 320;                                                                                                                                    
    maxViewport: 1920;                                                                                                                                   
  }                                                                                                                                                      
                                                                                                                                                         
  Конфигурация Tailwind v3:                                                                                                                              
  // tailwind.config.js                                                                                                                                  
  module.exports = {                                                                                                                                     
    plugins: [                                                                                                                                           
      require('fluid-tailwindcss')({                                                                                                                     
        minViewport: 375,                                                                                                                                
        maxViewport: 1440,                                                                                                                               
        useRem: true,                                                                                                                                    
        rootFontSize: 16,                                                                                                                                
        checkAccessibility: true,  // Предупреждает о слишком мелком шрифте                                                                              
      })                                                                                                                                                 
    ]                                                                                                                                                    
  }                                                                                                                                                      
                                                                                                                                                         
  Использование:                                                                                                                                         
  <!-- Синтаксис: fl-[property]-[min]/[max] -->                                                                                                          
                                                                                                                                                         
  <h1 class="fl-text-2xl/5xl">                                                                                                                           
    Шрифт от 2xl до 5xl                                                                                                                                  
  </h1>                                                                                                                                                  
                                                                                                                                                         
  <div class="fl-p-4/8 fl-gap-2/6">                                                                                                                      
    Padding 4 → 8, gap 2 → 6                                                                                                                             
  </div>                                                                                                                                                 
                                                                                                                                                         
  <!-- Произвольные значения -->                                                                                                                         
  <div class="fl-p-[1rem/3rem]">                                                                                                                         
    Padding 1rem → 3rem                                                                                                                                  
  </div>                                                                                                                                                 
                                                                                                                                                         
  <div class="fl-text-[14px/28px]">                                                                                                                      
    Шрифт 14px → 28px                                                                                                                                    
  </div>                                                                                                                                                 
                                                                                                                                                         
  <div class="fl-w-[200px/800px]">                                                                                                                       
    Ширина 200px → 800px                                                                                                                                 
  </div>                                                                                                                                                 
                                                                                                                                                         
  Генерируемый CSS:                                                                                                                                      
  .fl-p-\[1rem\/3rem\] {                                                                                                                                 
    padding: clamp(1rem, 0.0564rem + 4.1315vw, 3rem);                                                                                                    
  }                                                                                                                                                      
                                                                                                                                                         
  ---                                                                                                                                                    
  3. tailwindcss-fluid-type (Для типографики)                                                                                                            
                                                                                                                                                         
  Установка:                                                                                                                                             
  npm install tailwindcss-fluid-type                                                                                                                     
                                                                                                                                                         
  Конфигурация:                                                                                                                                          
  // tailwind.config.js                                                                                                                                  
  module.exports = {                                                                                                                                     
    corePlugins: {                                                                                                                                       
      fontSize: false,  // Отключить стандартные размеры                                                                                                 
    },                                                                                                                                                   
    plugins: [                                                                                                                                           
      require("tailwindcss-fluid-type")({                                                                                                                
        settings: {                                                                                                                                      
          fontSizeMin: 1.125,    // 18px base min                                                                                                        
          fontSizeMax: 1.25,     // 20px base max                                                                                                        
          ratioMin: 1.125,       // Minor third scale                                                                                                    
          ratioMax: 1.2,         // Major third scale                                                                                                    
          screenMin: 20,         // 320px                                                                                                                
          screenMax: 96,         // 1536px                                                                                                               
          unit: "rem",                                                                                                                                   
          prefix: "",            // или "fluid-"                                                                                                         
        },                                                                                                                                               
        values: {                                                                                                                                        
          xs: [-2, 1.6],         // [scale step, line-height]                                                                                            
          sm: [-1, 1.6],                                                                                                                                 
          base: [0, 1.6],                                                                                                                                
          lg: [1, 1.6],                                                                                                                                  
          xl: [2, 1.2],                                                                                                                                  
          "2xl": [3, 1.2],                                                                                                                               
          "3xl": [4, 1.2],                                                                                                                               
          "4xl": [5, 1.1],                                                                                                                               
          "5xl": [6, 1.1],                                                                                                                               
          "hero": [8, 1],                                                                                                                                
        },                                                                                                                                               
      }),                                                                                                                                                
    ],                                                                                                                                                   
  };                                                                                                                                                     
                                                                                                                                                         
  Расширенная конфигурация с letter-spacing:                                                                                                             
  values: {                                                                                                                                              
    heading: [                                                                                                                                           
      4,                                                                                                                                                 
      {                                                                                                                                                  
        lineHeight: 1.1,                                                                                                                                 
        letterSpacing: "-0.02em",                                                                                                                        
      },                                                                                                                                                 
    ],                                                                                                                                                   
  }                                                                                                                                                      
                                                                                                                                                         
  Использование:                                                                                                                                         
  <h1 class="text-hero">Hero текст</h1>                                                                                                                  
  <p class="text-base">Обычный текст</p>                                                                                                                 
                                                                                                                                                         
  ---                                                                                                                                                    
  Сравнение библиотек                                                                                                                                    
  ┌────────────────────────┬─────────────┬─────────────┬─────────┬───────────────────┬─────────────────────┐                                             
  │       Библиотека       │ Tailwind v4 │ Типографика │ Spacing │ Container Queries │      Синтаксис      │                                             
  ├────────────────────────┼─────────────┼─────────────┼─────────┼───────────────────┼─────────────────────┤                                             
  │ tailwind-clamp         │ ✅          │ ✅          │ ✅      │ ✅                │ clamp-[text,lg,3xl] │                                             
  ├────────────────────────┼─────────────┼─────────────┼─────────┼───────────────────┼─────────────────────┤                                             
  │ fluid-tailwindcss      │ ✅          │ ✅          │ ✅      │ ✅                │ fl-text-2xl/5xl     │                                             
  ├────────────────────────┼─────────────┼─────────────┼─────────┼───────────────────┼─────────────────────┤                                             
  │ tailwindcss-fluid-type │ ⚠️ v3       │ ✅          │ ❌      │ ❌                │ text-xl (авто)      │                                             
  └────────────────────────┴─────────────┴─────────────┴─────────┴───────────────────┴─────────────────────┘                                             
  ---                                                                                                                                                    
  Рекомендация для твоего проекта                                                                                                                        
                                                                                                                                                         
  Поскольку у тебя уже Tailwind v4 и ручная fluid система в globals.css, есть два пути:                                                                  
                                                                                                                                                         
  Вариант 1: Оставить как есть                                                                                                                           
  Твоя текущая система хорошо работает и даёт полный контроль.                                                                                           
                                                                                                                                                         
  Вариант 2: Добавить fluid-tailwindcss                                                                                                                  
  Если хочешь более удобный синтаксис в JSX:                                                                                                             
                                                                                                                                                         
  /* globals.css */                                                                                                                                      
  @import "tailwindcss";                                                                                                                                 
  @plugin "fluid-tailwindcss" {                                                                                                                          
    minViewport: 320;                                                                                                                                    
    maxViewport: 1920;                                                                                                                                   
  }                                                                                                                                                      
                                                                                                                                                         
  Тогда вместо:                                                                                                                                          
  <h1 style={{ fontSize: 'var(--font-size-hero)' }}>                                                                                                     
                                                                                                                                                         
  Можно писать:                                                                                                                                          
  <h1 className="fl-text-[3.5rem/8rem]">                                                                                                                 
                                                                                                                                                         
  Это даёт inline fluid значения прямо в классах без необходимости определять CSS-переменные заранее. 