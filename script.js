class FormSubmitter {
    constructor(formElement, successCallback, errorCallback) {
      this.form = formElement;
      this.successCallback = successCallback;
      this.errorCallback = errorCallback;
      this.controller = null;
      this.timeout = 10000;
      
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    handleSubmit(event) {
      event.preventDefault();
      this.submitForm();
    }
    
    async submitForm() {
      this.controller = new AbortController();
      const timeoutId = setTimeout(() => this.controller.abort(), this.timeout);
      
      try {
        const formData = new FormData(this.form);
        
        const response = await fetch('https://formcarry.com/s/REb9wxs4tJK', {
          method: 'POST',
          body: formData,
          signal: this.controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
          this.successCallback(result);
        } else {
          this.errorCallback(result.message || 'Unknown error occurred');
        }
      } catch (error) {
        clearTimeout(timeoutId);
        this.errorCallback(error.message);
      }
    }
    
    cancel() {
      if (this.controller) {
        this.controller.abort();
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    const successHandler = (result) => {
      console.log('Success:', result);
      alert('Форма успешно отправлена!');
    };
    
    const errorHandler = (error) => {
      console.error('Error:', error);
      alert(`Ошибка при отправке формы: ${error}`);
    };
    
    const formSubmitter = new FormSubmitter(form, successHandler, errorHandler);
  });