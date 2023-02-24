## Arma Lang
Arma Lang is a programming language, named after my favourite game Arma 3. Arma Lang, (after it's full implementation) is a domain specific language targeted towards building basic neural networks. While this may sound fancy, the language won't be available as a full-fledged library such as PyTorch, generally used for such cases. 

To elaborate, Arma Lang will provide functionality such as fetching data, training model, and fitting predictions. While traditional neural networks have several options to make the model the best it can, Arma Lang is supposed to be simple! The opportunity cost is that there are few ways to make the model more accurate. For instance, a simple program may look like this:
```
// Fetching data
data=get_data("C:\Data")

// Defining output classes
classes=("Food","House")

// Creating a basic, parameterless Convolutional Neural Ntework model
model=make_model()

// Training model
model.train(data, classes)

// Making a prediction
image=get_image(C:\Data\PicOfAFood.jpg)
print("Class: ",model.predict(image)) //Should display food
```
While tradiditional neural networks are much more dynamic, where you can define parameters such as batch sizes, augment data, set datatypes, set the number of epochs, et cetera, the functionality, and maybe even the mission statenent of this language itself is to be as simple as possible where users can create a basic neural netweok in just a few lines of code with default parameters.

The host language will be TypeScript. Since this project is configured with node, I can use TensorFlow.js to implement the Neural Network itself: https://www.tensorflow.org/js. This means that =, lets say when the code make_model() is parsed, the equivalent TensorFlow code will be run with parameters that I defined, that will make the model. Similar for training, and predicting data. 
For the time being, this lanaguage will only be able to support image classification with the help of Convolutional Neural Netrowks (CNN's)
