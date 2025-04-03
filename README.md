
![Badge-Spring](https://github.com/user-attachments/assets/8621dc37-27af-4e07-826c-91a39afd0679)

<h1 align="center"> Challenge_Forohub🗨️ </h1>

<h1 style="text-align: left;">Descripcion📝</h1>
Este proyecto es una aplicación que crea una API Rest la cual está centrada en un Foro, donde los usuarios pueden publicar consultas referentes a un curso, y pueden recibir respuestas de parte de "administradores" para la duda presentada.🚀
<h1 style="text-align: left;">Estado del proyecto: Finalizado📎</h1>
<h1 style="text-align: left;">Tecnologías empleadas📡 </h1>

* Java 17 ✅

* **Spring Boot** para el REST API y JPA ✅

* **Hibernate** gestion de base de datos ✅

* **MySQL** , **H2 Database** configuracion base de datos ✅
  
* **Spring Security 6** para proteger la información ✅
  
* **Token JWT** para generar el token de inicio de sesión ✅
  
* **Spring doc** genera una documentación clara y legible para los usuarios ✅

* **Maven (version 4+** Gestiona dependencias y construcción del proyecto. ✅
  
* **Spring web** Permite crear APIs RESTful y manejar solicitudes HTTP. ✅
  
* **Spring Boot DevTools** Facilita el desarrollo con reinicio automático y LiveReload. ✅
  
* **Flyway Migration** Gestiona versiones y migraciones de la base de datos. ✅
  
* - **Insomnia** Entorno de pruebas para la API creada. ✅
  
  
<h1 style="text-align: left;">🛠️ Requisitos Previos 💬</h1>

1. Java Development Kit (JDK) 17 o superior.
2. Un entorno de desarrollo como preferiblemenete IntelliJ IDEA.
3. Base de datos configurada (MySQL, H2 o similar) preferiblemente MySQL Workbench.
4. Maven instalado para la gestión de dependencias.
5. Insomnia para hacer las pruebas de la API.

<h1 style="text-align: left;">Tutorial de Uso e instalación 🖥️</h1>
1. Clona este repositorio e instalalo en tu computadora:

    ```bash
     [ git clone [https://github.com/tu-usuario/literalura.git](https://github.com/zIFelipe/Challenge_LiterAlura.git)
      cd LiterAlura](https://github.com/zIFelipe/Challenge_ForoHub.git)
    ```
    
2. Utiliza una IDE compatible con Java, preferiblemente IntelliJ IDEA.
   
3.  Configura tu base de datos en el archivo`application.properties`:

                  spring.application.name=LiterAlura_Callenge
                  spring.datasource.url=jdbc:postgresql://${DB_HOST}/${DB_NAME}
                  spring.datasource.username=${DB_USER}
                  spring.datasource.password=${DB_PASSWORD}
                   spring.jpa.show-sql=true
                  spring.jpa.properties.hibernate.format_sql=true
                  
                  server.error.include-stacktrace=never
                  spring.jpa.open-in-view=true
                  api.security.secret=${JWT_SECRET:123456}
4.  Compila el programa mediante "ChallengeForoHubApplication"
   

    

<h1 style="text-align: left;">Funciones 💡</h1>

### Clases y estructura principal:

---

### Paquete: `model` 🏷️
Este paquete contiene los paquetes y clases principales para la ejecucion del proyecto, como usuarios, cursos, respuestas y topicos(consultas).

#### Paquetes en `model`:

* **Curso**: cuenta con la entidad curso, además de las DTO actualizar curso, registrar curso y listar curos, tambien contamos con un repositorio para la conexión con la base de datos y un enum para las categorias.
  
* **Usuario**: Cuenta con la entidad usuario, además de las DTO actualizar usuario, registrar usuario, listar usuario y autenticar usuario (necesario para obtener el token), tambien tenemos el repositorio usuario para la conexión con la base de datos y un paquete de validaciones para evitar errores en la ejecucion del programa.

* **Topico**: Cuenta con la entidad topico, además de las DTO actualizar topico, registrar topico, listar topico, tambien tenemos el repositorio topico para la conexión con la base de datos y un paquete de validaciones para evitar errores en la ejecucion del programa.

* **Respuesta**: Cuenta con la entidad respuesta, además de las DTO actualizar respuesta, registrar respuesta, listar respuesta, tambien tenemos el repositorio respuesta para la conexión con la base de datos y un paquete de validaciones para evitar errores en la ejecucion del programa.

---

### Paquete: `infra` 📦
Este paquete contiene todo lo que refiere a seguridad del programa y la generación de los tokens, posee 3 paquetes, seguridad, errores y springdoc.

#### Clases en `seguriad`:

* **Authentication service**: Carga los detalles de un usuario desde la base de datos usando su nombre de usuario (login).
  
* **DatosJWTtoken**: contenedor simple para encapsular un token.
  
* **SecurityConfigurations**: configura las reglas de seguridad, cómo manejar la autenticación y el encriptado de contraseñas, asegurando que solo usuarios autorizados accedan a ciertas partes de la aplicación.
  
* **SecurityFilter**: actúa como un filtro de seguridad que verifica el token JWT de cada solicitud, valida al usuario y establece su autenticación en el contexto de seguridad de Spring, permitiendo acceder a recursos protegidos.
  
* **TokenService**: Clase encargada de la generación del token para ingresar a la aplicación.

---

### Paquete: `errores` 🔧
Este paquete contiene el tratado de errores como los 400.

#### Clases en `errores`:

* **TratadorErrores**: gestiona las excepciones en la aplicación, devolviendo respuestas adecuadas (como 404 Not Found o 400 Bad Request) cuando ocurren errores.

* **ValidacionException**: Es una excepción personalizada que se puede usar para indicar errores relacionados con validaciones en la aplicación.

### Paquete: `controller` 🔧
Este paquete contiene el controlador que compila las funciones principales CRUD de cada  entidad.

#### Clases en `controller`:

* **AuthenticationController**: Controlador enfocado en la autenticación del usuario para la obtención del token y acceder a otras funciones.

* **UsuarioController**: Controlador encargado de ejecutar las funciones CRUD de usuario como lo son registrar, actualziar, listar y eliminar.
  
* **CursoController**: Controlador encargado de ejecutar las funciones CRUD de curso como lo son registrar, actualziar, listar y eliminar.
  
* **TopicoController**: Controlador encargado de ejecutar las funciones CRUD de Topico como lo son registrar, actualziar, listar y eliminar.
  
* **RespuestaController**: Controlador encargado de ejecutar las funciones CRUD de Respuesta como lo son registrar, actualziar, listar y eliminar.

---
## Anotaciones estereotipadas 📊

En este proyecto se utilizaron diversas anotaciones para las clases como lo son:

### 1. **`@Entity` 📦**  
La anotación `@Entity` marca una clase como una **entidad JPA**, lo que significa que esa clase será mapeada a una tabla en la base de datos. Cada entidad debe tener al menos un campo que se identifique como la **clave primaria**

---

### 2. **`@Table` 🏷️**  
La anotación `@Table` se utiliza para **especificar la tabla de la base de datos** con la que se va a mapear la entidad.

---

### 3. **`@Id` 🔑**  
Con `@Id` se indica el campo que es la **clave primaria** de la entidad. Esto permite que JPA sepa cómo identificar de manera única cada instancia de la entidad en la base de datos.

---

### 4. **`@GeneratedValue` ⚙️**  
La anotación `@GeneratedValue` define la **estrategia de generación de valores** para la clave primaria. 

---

### 5. **`@Column` 📝**  
`@Column` especifica el **mapeo de una columna en la tabla de la base de datos**.

---

### 6. **`@OneToMany` 🔗**  
La anotación `@OneToMany` define una relación **uno a muchos** entre dos entidades. Indica que una entidad está asociada a muchas instancias de otra entidad, como un autor que tiene muchos libros.

---

### 7. **`@ManyToOne` 🔄**  
La anotación `@ManyToOne` establece una relación **muchos a uno** entre dos entidades. Es el opuesto de `@OneToMany`. Se utiliza cuando varias instancias de una entidad están asociadas a una sola instancia de otra entidad. Por ejemplo, muchos libros pueden estar asociados a un solo autor.

---

### 8. **`@Component` 🛠️**  
Marca una clase como un componente gestionado por Spring, que puede ser utilizado en cualquier parte de la aplicación para representar un objeto que Spring administrará.

---

### 9. **`@Repository` 🗂️**  
Indica que una clase es un repositorio de acceso a datos, es decir, que interactúa con una base de datos, y ayuda a manejar excepciones relacionadas con la persistencia.
---
### 10. **`@EnableWebSecurity` 🔐**  
Habilita la configuración de seguridad web en una aplicación Spring, permitiendo que se configure la protección de las rutas y la autenticación.

---

### 11. **`@Configuration` ⚙️**  
Indica que una clase contiene configuración para la aplicación, como la definición de beans que Spring debe gestionar, esencial para el contexto de la aplicación.
---
### 12. **`@Autowired` 🤖**  
Permite que Spring inyecte automáticamente una dependencia en una clase, ya sea un servicio, repositorio, entre otros, para simplificar la gestión de componentes.

---

### 13. **`@Service` 💼**  
Marca una clase como un servicio que contiene la lógica de negocio de la aplicación, generalmente usada para interactuar con los repositorios o realizar operaciones principales.

---

### 14. **`@PostMapping` 📤**  
Define una ruta HTTP POST en el controlador, utilizada para recibir solicitudes que envíen datos al servidor, como para crear un nuevo recurso.

---

### 15. **`@GetMapping` 📤**  
Define una ruta HTTP GET en el controlador, utilizada para manejar solicitudes que recuperan datos del servidor, comúnmente usada para leer o mostrar recursos.

---

### 16. **`@DeleteMapping` 🗑️**  
Define una ruta HTTP DELETE en el controlador, usada para eliminar un recurso en el servidor, generalmente identificando el recurso a través de su ID.

---

### 17. **`@PutMapping` 🔄**  
Define una ruta HTTP PUT en el controlador, usada para actualizar un recurso en el servidor, reemplazando completamente el recurso con los nuevos datos proporcionados.

---

### 18. **`@Transactional` 💡**  
Indica que los métodos dentro de una clase deben ser ejecutados dentro de una transacción, garantizando que todas las operaciones en el método sean atómicas y consistentes. 

---

<h1 style="text-align: left;">Desarrollado por 🎓</h1>
**Luis Felipe Méndez González 📠**  

---

<h1 style="text-align: left;">Validaciones ✅</h1>
El programa cuenta con validaciones para garantizar su correcto funcionamiento. No se podrán ingresar usuarios que ya estén registrados con el mismo nombre de usuario (login) o correo electrónico. Esto también aplica al momento de actualizar un usuario.
Además, no se podrán listar usuarios que no existan, ya sea mediante su ID o nombre de usuario. Tampoco se podrán registrar tópicos asociados a cursos o usuarios inexistentes. Para evitar spam, no será posible ingresar tópicos con el mismo título y mensaje, y esta restricción también aplica para su actualización. Asimismo, no se podrán listar tópicos que no se encuentren en la base de datos.
Por último, no se podrán registrar respuestas que no estén vinculadas a un tópico existente o a un usuario. Tampoco será posible listar respuestas inexistentes por su ID.


<h1 style="text-align: left;">Capturas del funcionamientos 🎓</h1>
Aqui se verá como funciona el programa y que hace cada opción

<h1 style="text-align: left;">Usuarios🎓</h1>

**`Login y obtención de token` ✅**  
![loginUsuario](https://github.com/user-attachments/assets/4e976bc2-e94d-4651-81d6-7add446c58e3)



**`Registrar usuario` ✅**  
![RegistrarUsuario](https://github.com/user-attachments/assets/780d4f61-5360-4fcc-994a-b458e651b5d3)



**`Listar usuario` ✅**  
![listarUsuarios](https://github.com/user-attachments/assets/dd1a81dc-b70d-4e56-8653-acc2282e3c1f)



**`Actualizar usuario` ✅**  
![actualizarUsuario](https://github.com/user-attachments/assets/e58f94a4-6ca0-4cde-8808-02790018b61b)



**`Eliminar usuario` ✅**  
![eliminarUsuario](https://github.com/user-attachments/assets/8daa8883-3da0-44ae-a832-fe5556340c04)



**`Cambios de eliminar y actualizar en listado usuario` ✅**  
![listado con actualizar y eliminarUsuario](https://github.com/user-attachments/assets/b8022302-86f6-4c8a-bc7e-f1b1f5b3854e)



---

<h1 style="text-align: left;">Cursos 📊</h1>

**`Registrar curso` ✅**
![registrarCurso](https://github.com/user-attachments/assets/89dad8e0-3e14-49b8-ac39-44693ee29570)



**`Listar curso` ✅** 
![listarCurso](https://github.com/user-attachments/assets/d29fd2ce-a502-4eb5-bd1b-225f924d86f0)



**`Actualizar curso` ✅** 
![actualizarCurso](https://github.com/user-attachments/assets/a5187a02-0d8c-4864-b003-3aaba8eff112)



**`Eliminar curso` ✅**  
![eliminarCurso](https://github.com/user-attachments/assets/f10bb988-61c1-4681-9619-159d8e2678e7)



**`Cambios de eliminar y actualizar en listado curso` ✅**  
![listadoCUrso con eliminar y actualziar](https://github.com/user-attachments/assets/5ceb3b90-dddd-4168-b87e-ff1ea0d26f04)



---

<h1 style="text-align: left;">Topico 🏷️</h1>

**`Registrar topico` ✅**
![registroTopico](https://github.com/user-attachments/assets/ab2930d9-c4ce-40f8-97ac-ee11b6159c22)



**`Listar topico` ✅** 
![listadoTopico](https://github.com/user-attachments/assets/9358c5d6-8c7a-4a8f-894d-b8554c96df57)



**`Actualizar topico titulo` ✅** 
![actualizarTitulo](https://github.com/user-attachments/assets/4d98a4a8-23a6-4762-a544-1a7f60fea85c)



**`Actualizar topico mensaje` ✅**   
![actualizarMensaje](https://github.com/user-attachments/assets/a8980131-1e4e-4622-8611-07e576eeb86e)


**`Eliminar topico` ✅**  
![eliminarTopico](https://github.com/user-attachments/assets/449ab820-d70a-42b4-9b59-8f914376d8ca)


**`Cambios de eliminar y actualizar en listado topico` ✅**  
![listado con eliminar y actualizar](https://github.com/user-attachments/assets/b5f3c252-4008-4691-bad2-14837db79f63)


---

<h1 style="text-align: left;">Respuesta ✅</h1>

**`Registrar respuesta` ✅**
![registrarRespuesta](https://github.com/user-attachments/assets/909c1b96-8614-46fe-ae2a-854892b18979)



**`Listar respuesta` ✅** 
![listarRespuesta](https://github.com/user-attachments/assets/e7d65e0c-7b4c-4f88-a752-30a12ed84448)


**`Eliminar respuesta` ✅**  
![eliminarRespuesta](https://github.com/user-attachments/assets/32d30428-806e-4dce-9534-2aa51a853b2d)



**`Cambios de eliminar en listado respuesta` ✅**
![listar con eliminar](https://github.com/user-attachments/assets/db65cf36-c781-4ec1-8695-b47d07c0f9a1)

---

<h1 style="text-align: left;">Consideraciones adicionales📝</h1>

El programa cuenta con algunas funciones get para cada una de las entidades. En el caso de los usuarios, se puede mostrar a todos los usuarios, independientemente de si están activos o no, mediante la URL: http://localhost:8080/usuarios/todos.
También se cuenta con la búsqueda por nombre (/nombre/{login}) y la búsqueda por ID (/id/{id}). Para los cursos, tenemos el listado de todos los cursos, independientemente de su actividad, en la URL: http://localhost:8080/cursos/todos, además de la búsqueda por ID (/{id}). De manera similar, para los tópicos, se pueden listar todos mediante la URL: http://localhost:8080/topicos/todos y también buscar por ID (/id/{id}). Por último, para las respuestas, tenemos la búsqueda por ID (http://localhost:8080/respuestas/id/{id}), la búsqueda por tópico (/topico/{topico_id}) y la búsqueda de respuestas de un usuario específico (/usuario/{usuario_id}).

---
Por otro lado, se debe considerar lo siguiente: al actualizar un usuario, se deben actualizar obligatoriamente el nombre del usuario y el email; de lo contrario, el programa lanzará una excepción.

En cuanto a las demás entidades, como "curso" y "tópico", los datos deben actualizarse de forma individual. Por ejemplo, si se quiere actualizar la categoría del curso, solo se podrá modificar ese dato, y si posteriormente se desea actualizar el título del curso, también se podrá hacer, pero de manera individual.

Esta misma lógica aplica para la entidad "tópico".

