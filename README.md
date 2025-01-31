# 🌱 **Soilitical**

Soilitical is an innovative AI-powered solution designed to assist landowners and farmers in making informed decisions about crop planting to maximize yield and profitability. By leveraging IoT sensors, Soilitical collects real-time data from agricultural fields and utilizes advanced machine learning models to recommend the most suitable crops based on various environmental factors.

Live Demo: https://soilitical.netlify.app/

## 🚀 **Features**

- **Modern User Interface**: A sleek and intuitive design that enhances user experience.
- **AI Crop Recommendations**: Machine learning algorithms provide tailored crop suggestions for optimal yield.
- **User-Friendly Experience**: Simplified navigation and interaction for all users, regardless of technical expertise.
- **API Connection with the Backend**: Seamless integration with the Django backend to manage user accounts and process data efficiently.
- **Interactive Map Picker**: Users can select specific locations on a map to receive localized crop recommendations and insights.

## 🌾 **Current State**

- **Home Page**: Features a navigation bar and a login form for user access.
- **Map Picker Component**: Allows users to interactively select locations for crop recommendations.
- **Firefly Background Animation**: Enhances the visual appeal of the application with dynamic background elements.

## 📦 **Installation**

To get started with Soilitical, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone [https://github.com/yourusername/soilitical-frontend.git](https://github.com/Soilitical/Soilitical2.0.git)
   cd Soilitical-front
   ```

# **Frontend**

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Application**:

   ```bash
   npm start
   ```

4. **Setup your .env file in the root of Soilitical-front**

   .env

   ```bash
   VITE_API_URL= "http://127.0.0.1:8000/"
   VITE_MODEL_URL = "https://example.modelapi.com/predict/"
   VITE_WEATHER_API_KEY="your_weather_api_key"
   ```

5. **Access the Application**: Open your browser and navigate to `http://localhost:3000`.

# **Backend**

6.**Open a new terminal**:

```bash
cd Soilitical-back
```

7. **Install Python Dependencies**:

```bash
   pip install -r requirements.txt
```

8. **Set Up SQLite Database**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
9. **Run the Django Server**:
   ```bash
   python manage.py runserver
   ```
10. **Environment Setup**
    Create a .env file in the backend directory's root:

Soilitical-backend/

├── manage.py

├── .env <-- Here

and fill it with:

```bash
   SECRET_KEY=your_django_secret_key_here
   DEBUG=True
```

## 📊 **Usage**

- **User Registration**: Create an account to access personalized crop recommendations.
- **Map Interaction**: Use the interactive map to select specific areas for analysis.
- **View Recommendations**: Receive tailored crop suggestions based on real-time data and AI analysis.

## 🛠️ **Technologies Used**

- **Frontend**: React.js, Leaflet for mapping, and TailwindCSS for styling.
- **Backend**: Django (not included in this repository).
- **Machine Learning**: Utilizes machine learning model connecting to the app using an API, similar to: https://github.com/Soilitical/Soilitical-AI-Api.

## 🤝 **Contributing**

We welcome contributions to Soilitical! If you have suggestions or improvements, please fork the repository and submit a pull request.

## 📞 **Contact**

For any inquiries or support, please reach out to [hasanabdelhady101@gmail.com].

Pictures From Soilitical:
![image](https://github.com/user-attachments/assets/356962da-dbcc-42f8-b31f-a84590091bb6)
![image](https://github.com/user-attachments/assets/414ae31c-3d81-4247-a427-6e0fbfdcb0e5)
![image](https://github.com/user-attachments/assets/dc53aaad-3940-4169-a958-60ee324040ff)
![image](https://github.com/user-attachments/assets/9dc8a3b5-2985-401a-ac55-cc2ec6061f1b)
![image](https://github.com/user-attachments/assets/a713c28d-b7f8-44d1-988b-33068da66b3e)
![image](https://github.com/user-attachments/assets/042c41d7-7d9a-4a84-995c-e729338b587e)
![image](https://github.com/user-attachments/assets/78557ed9-b8e0-4ed7-9fa8-5705ef3ef39e)
![image](https://github.com/user-attachments/assets/9da3f945-afe2-4b01-a6cd-fb659c3d13b5)
![image](https://github.com/user-attachments/assets/ed0c9f28-17e2-49ee-8045-6ffd7bcaa180)

---

Thank you for using Soilitical! Together, we can cultivate a more sustainable and productive agricultural future.
