// Email Service Configuration for OPG Bataan
const EMAIL_CONFIG = {
    adminEmail: 'opg@bataan.gov.ph',
    adminPassword: 'OPGBATAAN2025', // This would be used server-side only
    smtpServer: 'mail.bataan.gov.ph',
    smtpPort: 587,
    enableEmailNotifications: true,
    enableAdminDashboard: true
};

// Admin notification settings
const ADMIN_SETTINGS = {
    receiveEmailNotifications: true,
    receiveFileUploads: true,
    dashboardUpdateInterval: 30000, // 30 seconds
    emailSubjectPrefix: '[OPG Request]'
};

// Email templates
const EMAIL_TEMPLATES = {
    newRequest: (data) => ({
        subject: `${ADMIN_SETTINGS.emailSubjectPrefix} New ${data.type} Request from ${data.name}`,
        body: `
New Request Submitted
====================

Request Type: ${data.type}
Submitted By: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Office/Department: ${data.office || 'N/A'}

Purpose/Details:
${data.purpose}

Submitted At: ${new Date(data.submittedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })} (GMT+8)

---
This is an automated notification from the Office of the Provincial Governor website.
        `
    }),
    
    confirmationToUser: (data) => ({
        subject: `${ADMIN_SETTINGS.emailSubjectPrefix} Request Received - ${data.type}`,
        body: `
Dear ${data.name},

Thank you for submitting your request to the Office of the Provincial Governor.

Request Details:
- Type: ${data.type}
- Submitted: ${new Date(data.submittedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })} (GMT+8)

Your request has been received and is being processed. You will be notified via email once it has been reviewed.

For inquiries, please contact us at opg@bataan.gov.ph or call (047) 237-2224.

Best regards,
Office of the Provincial Governor
Bataan Provincial Government
        `
    })
};

// Simulated email sending function (would be replaced with actual SMTP integration)
async function sendEmail(to, template, data) {
    // In a real implementation, this would connect to an SMTP server
    // For now, we simulate the email sending and log to console
    const emailContent = template(data);
    
    console.log('=== EMAIL SENT ===');
    console.log('To:', to);
    console.log('Subject:', emailContent.subject);
    console.log('Body:', emailContent.body);
    console.log('==================');
    
    // Store in localStorage for admin dashboard viewing
    storeEmailInAdminQueue({
        to: to,
        subject: emailContent.subject,
        body: emailContent.body,
        data: data,
        timestamp: new Date().toISOString(),
        status: 'sent'
    });
    
    return { success: true, messageId: generateMessageId() };
}

function generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function storeEmailInAdminQueue(emailData) {
    let adminQueue = JSON.parse(localStorage.getItem('adminEmailQueue') || '[]');
    adminQueue.unshift(emailData);
    // Keep only last 100 messages
    if (adminQueue.length > 100) {
        adminQueue = adminQueue.slice(0, 100);
    }
    localStorage.setItem('adminEmailQueue', JSON.stringify(adminQueue));
    
    // Trigger admin dashboard update if it's open
    window.dispatchEvent(new CustomEvent('newAdminRequest', { detail: emailData }));
}

// Function to handle file uploads and send to admin
async function handleFileUploadForEmail(files, requestData) {
    const uploadedFiles = [];
    
    for (let file of files) {
        // Convert file to base64 for storage
        const base64File = await fileToBase64(file);
        uploadedFiles.push({
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64File
        });
    }
    
    // Store in admin file queue
    let fileQueue = JSON.parse(localStorage.getItem('adminFileQueue') || '[]');
    fileQueue.unshift({
        requestId: requestData.id,
        files: uploadedFiles,
        submittedBy: requestData.name,
        timestamp: new Date().toISOString(),
        requestType: requestData.type
    });
    
    if (fileQueue.length > 50) {
        fileQueue = fileQueue.slice(0, 50);
    }
    localStorage.setItem('adminFileQueue', JSON.stringify(fileQueue));
    
    return uploadedFiles;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Export for use in other scripts
window.EMAIL_CONFIG = EMAIL_CONFIG;
window.sendEmail = sendEmail;
window.EMAIL_TEMPLATES = EMAIL_TEMPLATES;
window.handleFileUploadForEmail = handleFileUploadForEmail;
