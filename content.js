console.log('✔ Smart content script loaded on:', window.location.href);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function autoScrollAndExtract() {
  console.log('⟳ Starting Auto-Scroll Extraction...');
  const numbers = new Set();
  
  let container = document.querySelector('#pane-side');
  if (!container) {
    const scrollables = Array.from(document.querySelectorAll('div')).filter(el => el.scrollHeight > el.clientHeight + 100);
    container = scrollables[scrollables.length - 1]; 
  }

  if (!container) {
    throw new Error("Could not find a scrollable list. Please open the chat list or a group's participant list.");
  }

  container.scrollTop = 0;
  await sleep(1000); 

  let previousScrollTop = -1;
  let scrollAttempts = 0;
  const maxAttempts = 3; 

  while (scrollAttempts < maxAttempts) {
    scrapeVisibleNumbers(numbers);
    previousScrollTop = container.scrollTop;
    container.scrollTop += container.clientHeight;
    await sleep(800); 

    if (container.scrollTop === previousScrollTop) {
      scrollAttempts++; 
    } else {
      scrollAttempts = 0; 
    }
  }

  const uniqueNumbers = Array.from(numbers).sort();
  console.log(`✔ Extraction complete! Found ${uniqueNumbers.length} numbers.`);
  return uniqueNumbers;
}

function scrapeVisibleNumbers(numbersSet) {
  const nameElements = document.querySelectorAll('span[dir="auto"], span[title], div[role="gridcell"]');

  nameElements.forEach(element => {
    const text = (element.title || element.textContent || '').trim();

    if (isStrictlyPhoneNumber(text)) {
      const cleaned = cleanPhoneNumber(text);
      if (isValidPhoneNumber(cleaned)) {
        numbersSet.add(cleaned);
      }
    }
  });
}

function isStrictlyPhoneNumber(text) {
  if (!text || text.length < 6 || text.length > 25) return false;
  const stripped = text.replace(/[\s\-\(\)\+]/g, '');
  if (!/^\d+$/.test(stripped)) return false;
  return stripped.length >= 7 && stripped.length <= 16;
}

function cleanPhoneNumber(number) {
  if (!number) return '';
  let cleaned = number.replace(/[\s\-\(\)\.]/g, '').trim();
  if (cleaned.startsWith('0092')) cleaned = '+92' + cleaned.substring(4);
  else if (cleaned.startsWith('00880')) cleaned = '+880' + cleaned.substring(5);
  else if (cleaned.startsWith('00')) cleaned = '+' + cleaned.substring(2);
  return cleaned;
}

function isValidPhoneNumber(number) {
  if (!number || number.length < 6) return false;
  const digitsOnly = number.replace(/[^\d+]/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 16;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractNumbers') {
    autoScrollAndExtract()
      .then(numbers => {
        sendResponse({ 
          numbers: numbers,
          success: true
        });
      })
      .catch(error => {
        console.error('❌ Error:', error);
        sendResponse({ 
          numbers: [], 
          error: error.message,
          success: false
        });
      });
      
    return true; 
  }
});