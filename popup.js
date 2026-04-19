let extractedNumbers = [];

// DOM Elements (Updated to match the modern HTML structure)
const scanBtn = document.getElementById('scanBtn');
const exportBtn = document.getElementById('exportBtn');
const exportTxtBtn = document.getElementById('exportTxtBtn'); // Added TXT button
const copyBtn = document.getElementById('copyBtn');
const resultsSection = document.getElementById('resultsSection');
const loadingState = document.getElementById('loadingState');
const message = document.getElementById('message');
const numbersList = document.getElementById('numbersList');
const resultCount = document.getElementById('resultCount');


function showMessage(text, type = 'info') {
  message.textContent = text;
  message.className = `message ${type}`;
  message.classList.remove('hidden');
  
  
  setTimeout(() => {
    message.classList.add('hidden');
  }, 3000);
}


scanBtn.addEventListener('click', async () => {
  try {

    loadingState.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    message.classList.add('hidden');


    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    // Verify we are on WhatsApp Web
    if (!activeTab.url.includes('web.whatsapp.com')) {
      loadingState.classList.add('hidden');
      showMessage('✗ Please open WhatsApp Web first!', 'error');
      return;
    }

    chrome.tabs.sendMessage(
      activeTab.id, 
      { action: 'extractNumbers' }, 
      (response) => {
        loadingState.classList.add('hidden');

        if (chrome.runtime.lastError) {
          showMessage('⚠️ Could not connect. Refresh WhatsApp Web and try again.', 'error');
          return;
        }

        if (response && response.success) {
          extractedNumbers = response.numbers;

          if (extractedNumbers.length === 0) {
            showMessage('📞 No unsaved numbers found on screen.', 'info');
            return;
          }

          // Show results
          displayNumbers();
          resultsSection.classList.remove('hidden');
          showMessage(`✔ Found ${extractedNumbers.length} number(s)!`, 'success');
        } else {
          showMessage('⚠️ Error during extraction.', 'error');
        }
      }
    );
  } catch (error) {
    loadingState.classList.add('hidden');
    showMessage('❌ Error: ' + error.message, 'error');
  }
});


function displayNumbers() {
  numbersList.innerHTML = '';
  resultCount.textContent = extractedNumbers.length;

  extractedNumbers.forEach((number) => {
    const item = document.createElement('div');
    item.className = 'number-item';
    item.textContent = number;
    numbersList.appendChild(item);
  });
}


exportBtn.addEventListener('click', () => {
  if (extractedNumbers.length === 0) {
    showMessage('❌ No numbers to export', 'error');
    return;
  }


  let csvContent = '\uFEFF';
  csvContent += 'Phone Number\n'; 


  extractedNumbers.forEach(number => {
    csvContent += `="${number}"\n`;
  });


  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `whatsapp_unsaved_${new Date().toISOString().split('T')[0]}.csv`);
  
  document.body.appendChild(link);
  link.click();
  

  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showMessage(`✔ Exported ${extractedNumbers.length} numbers!`, 'success');
});


exportTxtBtn.addEventListener('click', () => {
  if (extractedNumbers.length === 0) {
    showMessage('❌ No numbers to export', 'error');
    return;
  }

  let txtContent = 'Number\n';

  extractedNumbers.forEach(number => {
    txtContent += `${number}\n`;
  });

  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `whatsapp_unsaved_${new Date().toISOString().split('T')[0]}.txt`);
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showMessage(`✔ Exported ${extractedNumbers.length} numbers to TXT!`, 'success');
});

copyBtn.addEventListener('click', () => {
  if (extractedNumbers.length === 0) {
    showMessage('❌ No numbers to copy', 'error');
    return;
  }

  const allNumbers = extractedNumbers.join('\n');
  navigator.clipboard.writeText(allNumbers);
  
  showMessage('📋 Copied to clipboard!', 'success');
});