const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 بدء تشغيل البوت...');
  
  try {
    // إعدادات إطلاق المتصفح المناسبة لـ Render
    const browser = await puppeteer.launch({
      headless: 'new', // استخدام وضع headless الجديد
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ],
      executablePath: process.env.CHROMIUM_PATH || undefined // للتوافق مع Render
    });

    console.log('✅ المتصفح تم إطلاقه بنجاح');

    const page = await browser.newPage();
    
    // إعداد User Agent ليكون أكثر واقعية
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('🌐 الانتقال إلى الموقع...');
    
    await page.goto('https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_button_test', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('🔍 جارٍ استخراج الأزرار...');

    // البحث عن الأزرار بكل الطرق الممكنة
    const buttons = await page.evaluate(() => {
      const selectors = [
        'button',
        'input[type="button"]',
        'input[type="submit"]',
        'input[type="reset"]',
        '[role="button"]',
        '[onclick]',
        '.btn',
        '.button',
        'a.btn',
        'a.button'
      ];

      const uniqueElements = new Set();
      const buttonsData = [];

      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (!uniqueElements.has(element)) {
              uniqueElements.add(element);
              
              // استخراج المعلومات من العنصر
              let text = '';
              if (element.innerText) {
                text = element.innerText.trim();
              } else if (element.value) {
                text = element.value.trim();
              } else if (element.textContent) {
                text = element.textContent.trim();
              }

              buttonsData.push({
                tag: element.tagName.toLowerCase(),
                text: text || '(بدون نص)',
                id: element.id || '(بدون ID)',
                class: element.className || '(بدون class)',
                type: element.type || element.getAttribute('type') || 'N/A',
                selector: selector
              });
            }
          });
        } catch (error) {
          // تجاهل الأخطاء في بعض العناصر
        }
      });

      return buttonsData;
    });

    console.log('📊 النتائج:');
    console.log('='.repeat(50));
    
    if (buttons.length === 0) {
      console.log('❌ لم يتم العثور على أي أزرار');
    } else {
      console.log(`✅ تم العثور على ${buttons.length} زر/أزرار:`);
      console.log('');
      
      buttons.forEach((btn, index) => {
        console.log(`🔘 الزر ${index + 1}:`);
        console.log(`   العلامة: ${btn.tag}`);
        console.log(`   النص: "${btn.text}"`);
        console.log(`   الـ ID: ${btn.id}`);
        console.log(`   الـ Class: ${btn.class}`);
        console.log(`   النوع: ${btn.type}`);
        console.log(`   المحدد: ${btn.selector}`);
        console.log('');
      });
    }
    
    console.log('='.repeat(50));

    await browser.close();
    console.log('✅ تم إغلاق المتصفح بنجاح');
    process.exit(0);

  } catch (error) {
    console.error('❌ حدث خطأ:', error.message);
    console.error('تفاصيل الخطأ:', error.stack);
    process.exit(1);
  }
})();
