var store = [{
        "title": "Django Setting",
        "excerpt":"Pipenv 를 이용하여 가상환경 Setting pipenv 란? → python 에서 사용하는 가상환경을 구성하는 방식 중 하나. pipenv 를 사용하는 이유 → 프로젝트별로 다른 패키지를 사용하며, 같은 패키지를 사용하더라도 버전이 다른 경우가 있기 때문에 pipenv 로 가상환경을 만든다. 설치방법 → pipenv 를 설치하기 전에 python 을 설치 해야 함. 아래 부터는...","categories": ["Django"],
        "tags": ["Django","Python"],
        "url": "/django/Django-Setting/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Django, Nginx, Gunicorn Setting (CentOS)",
        "excerpt":"Python3 설치 yum 으로 python3 설치 yum install python3 -y yum 으로 python3 을 설치하면 pip3 도 같이 설치됨 python3 를 입력. 아래와 같이 나오면 설치 완료 설치하고자 하는 프로젝트 경로에 가상환경 설치 /usr/local/thriller/thriller pip3 install virtualenv virtualenv venv 가상환경에 접속 source venv/bin/activate 가상환경에서 빠져나옴 deactivate MySQL DataBase, 사용자 생성...","categories": ["Django"],
        "tags": ["Django","Python","Nginx","Gunicorn"],
        "url": "/django/Django-Nginx-Gunicorn/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Django Forms",
        "excerpt":"Django Form 장고에는 Model 클래스를 이용하여 Form 을 자동으로 생성하는 기능이 있다. 장고의 폼에는 is_valid() 라는 함수가 있다 is_valid() 란? ⇒ 입력받은 폼에 대한 유효성을 검사 views.py from django.views import View from django.shortcuts import render from . import forms class LoginView(View): def get(self, request): form = forms.LoginForm(initial={\"email\": \"\"}) return render(request,...","categories": ["Django"],
        "tags": ["Django","Python"],
        "url": "/django/Django-Forms/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Django User Settings",
        "excerpt":"AUTH_USER_MODEL 설정 장고에는 기본적으로 내장되어있는 AbstractUser 이 있다. 내장된 AbstractUser 를 사용할 수도 있지만 보통은 새롭게 정의해서 사용하기 때문에 아래 설정을 settings.py 파일에서 해준다. → 아래 설정을 생략하면 장고의 기본적으로 세팅되어있는 user 모델과 혼동이 올 수 있음 AUTH_USER_MODEL = 'users.User' LOGIN_URL, LOGIN_REDIRECT_URL 설정 Django 의 Login, Logout 메커니즘은 next 라는...","categories": ["Django"],
        "tags": ["Django","Python"],
        "url": "/django/Django-User-Settings/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "jekyll 로 fork 해온 git blog 테마, 잔디밭 안심어질 때",
        "excerpt":"현재상태 git blog 를 생성하면서 jekyll 테마를 fork 해서 내 repository 에 생성을 했었는데 잔디밭이 안심어지는 현상을 발견! (이왕이면 심어지면 좋으니까..) 아마 내 repository 가 아닌 다른 사람의 repository 에 push 되고 있는게 아닐까 생각.. 해결방안 github 에 새로운 repository 를 생성 (new_blog) 기존에 있는 repository 를 bare clone 한다...","categories": ["Github"],
        "tags": ["Git","Gitblog","Github"],
        "url": "/github/fork-gitblog/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "python3, pip3 Symbolic Link 설정",
        "excerpt":"현재상태 Linux 에는 기본적으로 Python2 버전이 설치된다. CentOS 에서 Python3 버전을 설치했는데 python 을 입력할 경우 2.x 버전으로 인식한다. 매번 python3 으로 명령어를 입력하는게 불편하여 구글링 해보니 Symbolic Link 를 통해 해결할 수 있다고 한다. 해결방안 python3 설정 # 현재 심볼릭 링크 확인 ls -l /bin/python* # lrwxrwxrwx. 1 root...","categories": ["Python"],
        "tags": ["Python","Linux"],
        "url": "/python/python3-pip3-symbolic-link/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Optional 이란",
        "excerpt":"기존의 null 처리 아래 코드는 값(주소) 이 있다면 문제가 없는 코드이다. System.out.println(house.getAddress()); 하지만, 값(주소) 이 없다면 NPE 가 발생 한다. 따라서, null 처리를 위해선 다음과 같이 코드를 작성하였다. if (house.getAddress() != null) { System.out.println(house.getAddress()); } if 문을 사용하면 null 처리를 할 수 있다. 위의 코드는 간단하여 보기에 좋지만 수 많은...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-Optional/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "테스트 코드",
        "excerpt":"테스트 코드란 프로그램 작성 시 문제가 없는지 확인하기 위해 사용 테스트 코드를 작성하는 이유 빠른 피드백 자동검증이 가능 개발자가 만든 기능을 안전하게 보호해 준다. 테스트 코드 작성 방법 → 메서드를 작성하고 그 위에 @Test 를 작성하면 된다. → 테스트코드는 직관적으로 보기 위해 메소드를 한글로 작성하기도 한다 → 테스트코드는 빌드 시...","categories": ["SpringBoot"],
        "tags": ["Java","SpringBoot","JPA"],
        "url": "/springboot/Java-TESTCODE/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "컴포넌트 스캔과 자동 의존관계",
        "excerpt":"의존관계주입(DI) 이란? 객체 간의 의존 관계를 만드는 것 Spring 의 IOC 컨테이너의 구체적인 구현 방식 의존관계 설정 컨트롤러(Controller)가 서비스(Service)와 리포지토리(Repository)를 사용할 수 있게 의존관계를 준비 → 컨트롤러에 @Controller 만 붙인다고 service 와 repository 를 사용할 수 있는게 아니다 controller/MemberController.java package hellospring.hello.controller; import hellospring.hello.service.MemberService; import org.springframework.beans.factory.annotation.Autowired; import org.springframework.stereotype.Controller; @Controller public class...","categories": ["SpringBoot"],
        "tags": ["Java","SpringBoot"],
        "url": "/springboot/Java-ComponentScan-DI/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Transform",
        "excerpt":"CSS Transform → css3 부터 적용됨 → 크기 위치 변경 기존의 css 는 왼쪽 위를 기준으로 크기나 위치를 변경했다면 css transform 의 경우 기준점이 중앙이고 기준점 변경도 가능하다 아래의 예제를 살펴보면, &lt;!DOCTYPE html&gt; &lt;html lang=\"en\"&gt; &lt;head&gt; &lt;meta charset=\"UTF-8\"&gt; &lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"&gt; &lt;meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"&gt; &lt;title&gt;Interactive Web&lt;/title&gt; &lt;link rel=\"stylesheet\" href=\"css/reset.css\"&gt;...","categories": ["CSS"],
        "tags": ["CSS"],
        "url": "/css/CSS-Transform/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Transition",
        "excerpt":"Transition 이란? → css 속성을 변경할 때 애니메이션 속도를 조절하는 방법을 제공 → 값이 있을때 그값이 변화한다면 그 중간과정을 정의한 애니메이션 transform 에 적용한 transition .box { width: 100px; height: 100px; border: 2px solid black; background: rgba(255,255,0,0.7); transition: 1s; } .box:hover { transform: scale(1.5); } width와 background 에 적용한 transition...","categories": ["CSS"],
        "tags": ["CSS"],
        "url": "/css/CSS-Transition/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "CSS3 기본",
        "excerpt":"top, left, right, bottom 속성 position 을 fixed 로 설정하고 top, left, right, bottom 값을 설정하면 스크롤을 내려도 고정적으로 보인다. 웹페이지의 오른쪽 하단에 top 버튼에 주는 속성과 같다. top-button { position: fixed; bottom: 50px; right: 50px; } hover, transition 속성 마우스 오버 했을 때 변화를 주려면 hover 속성을 사용하면 된다....","categories": ["CSS"],
        "tags": ["CSS"],
        "url": "/css/CSS-CSS3/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Flex란",
        "excerpt":"Flex 란 Flex 는 레이아웃 배치 전용 기능 기존에 사용하던 float 와 inline-block 을 대체할 수 있음 Flex 레이아웃을 만들기 위한 기본적인 HTML 구조 &lt;div class=\"container\"&gt; &lt;div class=\"item\"&gt;helloflex&lt;/div&gt; &lt;div class=\"item\"&gt;abc&lt;/div&gt; &lt;div class=\"item\"&gt;helloflex&lt;/div&gt; &lt;/div&gt; 부모요소 (div.container) 를 Flex Container 자식요소 (div.item) 를 Flex Item Flex 의 속성에는 컨테이너에 적용하는 속성 아이템에...","categories": ["CSS"],
        "tags": ["CSS"],
        "url": "/css/CSS-Flex1/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Flex 컨테이너",
        "excerpt":"Flex 컨테이너에 적용하는 속성 display: flex; display: none; 일때 display: flex; 적용시 .container { display: flex; /* display: inline-flex; */ } display: inline-flex; 일때 Flex 아이템들이 가로 방향으로 배치, 아이템들이 가진 내용물들의 width 만큼만 차지! height 는 컨테이너 높이만큼 늘어남 float 와 flex 의 차이점! flex 는 height 가 컨테이너...","categories": ["CSS"],
        "tags": ["CSS"],
        "url": "/css/CSS-Flex2/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Flex 아이템에 적용하는 속성",
        "excerpt":"유연한 박스의 기본 영역, flex-basis flex-basis 는 flex 아이템의 기본 크기를 설정함 flex-direction (오뎅꼬치) 이 row 일 때는 너비, column 일 때는 높이 .item { flex-basis: auto; /* 기본값 */ /* flex-basis: 0; */ /* flex-basis: 50%; */ /* flex-basis: 300px; */ /* flex-basis: 10rem; */ /* flex-basis: content; */...","categories": ["CSS"],
        "tags": ["CSS"],
        "url": "/css/CSS-Flex3/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Flex 반응형 컬럼",
        "excerpt":"Flex 반응형 컬럼 예제 base.html &lt;!DOCTYPE html&gt; &lt;html&gt; &lt;head&gt; &lt;meta charset=\"UTF-8\"&gt; &lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"&gt; &lt;meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"&gt; &lt;title&gt;CSS Flex&lt;/title&gt; &lt;link rel=\"stylesheet\" href=\"default.css\"&gt; &lt;/head&gt; &lt;body&gt; &lt;div class=\"flex-container\"&gt; &lt;div class=\"flex-item\"&gt;AAAAAAAAAAAAAAA&lt;/div&gt; &lt;div class=\"flex-item\"&gt;BB&lt;/div&gt; &lt;div class=\"flex-item\"&gt;AAAAAAAAAAAAAAA&lt;/div&gt; &lt;div class=\"flex-item\"&gt;BB&lt;/div&gt; &lt;div class=\"flex-item\"&gt;AAAAAAAAAAAAAAA&lt;/div&gt; &lt;div class=\"flex-item\"&gt;BB&lt;/div&gt; &lt;div class=\"flex-item\"&gt;AAAAAAAAAAAAAAA&lt;/div&gt; &lt;div class=\"flex-item\"&gt;BB&lt;/div&gt; &lt;div class=\"flex-item\"&gt;AAAAAAAAAAAAAAA&lt;/div&gt; &lt;div class=\"flex-item\"&gt;BB&lt;/div&gt; &lt;div class=\"flex-item\"&gt;AAAAAAAAAAAAAAA&lt;/div&gt; &lt;div...","categories": ["CSS"],
        "tags": ["CSS"],
        "url": "/css/CSS-Flex-Responsive-Column/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Flex 유용한 기법들",
        "excerpt":"flex items 중 하나만 오른쪽 끝으로 붙이고 싶을 때 &lt;!DOCTYPE html&gt; &lt;html&gt; &lt;head&gt; &lt;meta charset=\"UTF-8\"&gt; &lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"&gt; &lt;meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"&gt; &lt;title&gt;CSS Flex&lt;/title&gt; &lt;link rel=\"stylesheet\" href=\"default.css\"&gt; &lt;/head&gt; &lt;body&gt; &lt;div class=\"flex-container\"&gt; &lt;div class=\"flex-item\"&gt;A&lt;/div&gt; &lt;div class=\"flex-item\"&gt;B&lt;/div&gt; &lt;div class=\"flex-item\"&gt;C&lt;/div&gt; &lt;/div&gt; &lt;/body&gt; &lt;/html&gt; .flex-container { display: flex; /* justify-content: space-between; */ /* width:...","categories": ["CSS"],
        "tags": ["CSS"],
        "url": "/css/CSS-Flex-Uses/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Flex UI 만들기1",
        "excerpt":"1. Menu menu.html &lt;!DOCTYPE html&gt; &lt;html&gt; &lt;head&gt; &lt;meta charset=\"UTF-8\"&gt; &lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"&gt; &lt;meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"&gt; &lt;title&gt;CSS Flex&lt;/title&gt; &lt;link rel=\"stylesheet\" href=\"default.css\"&gt; &lt;link rel=\"stylesheet\" href=\"ui.css\"&gt; &lt;/head&gt; &lt;body&gt; &lt;ul class=\"menu\"&gt; &lt;li class=\"menu-item\"&gt; &lt;a href=\"#\" class=\"menu-link\"&gt;Home&lt;/a&gt; &lt;/li&gt; &lt;li class=\"menu-item\"&gt; &lt;a href=\"#\" class=\"menu-link\"&gt;About&lt;/a&gt; &lt;/li&gt; &lt;li class=\"menu-item\"&gt; &lt;a href=\"#\" class=\"menu-link\"&gt;Product&lt;/a&gt; &lt;/li&gt; &lt;li class=\"menu-item\"&gt; &lt;a href=\"#\"...","categories": ["CSS"],
        "tags": ["CSS"],
        "url": "/css/CSS-Flex-UI1/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Flex UI 만들기2",
        "excerpt":"6. Modal modal.html &lt;!DOCTYPE html&gt; &lt;html&gt; &lt;head&gt; &lt;meta charset=\"UTF-8\"&gt; &lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"&gt; &lt;meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"&gt; &lt;title&gt;CSS Flex&lt;/title&gt; &lt;link rel=\"stylesheet\" href=\"default.css\"&gt; &lt;link rel=\"stylesheet\" href=\"ui.css\"&gt; &lt;/head&gt; &lt;body&gt; &lt;div class=\"modal\"&gt; &lt;div class=\"dialog\"&gt; Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, et. Dolor facilis architecto sunt, quis eius animi ea vel labore?...","categories": ["CSS"],
        "tags": ["CSS"],
        "url": "/css/CSS-Flex-UI2/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "EntityManager 와 영속성 컨텍스트 (PersistenceContext)",
        "excerpt":"엔티티 매니저 (EntityManager) 엔티티를 저장, 수정, 삭제, 조회 등 엔티티와 관련된 작업을 수행 @PersistenceContext 를 통해 EntityManager 를 주입 받아 사용 @Repository public class Repository { @PersistenceContext EntityManager em; em.find(); // 엔티티 조회 em.persist(); // 엔티티 저장 em.remove(); // 엔티티 삭제 em.flush(); // 영속성 컨텍스트 내용을 데이터베이스에 반영 em.detach(); //...","categories": ["JPA"],
        "tags": ["Java","JPA"],
        "url": "/jpa/Java-EntityManager/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Transactional 이란",
        "excerpt":"트랜잭션이란? 데이터베이스의 상태를 변경하는 작업 한번에 수행되어야 하는 연산들을 의미 begin, commit 을 자동으로 수행 예외 발생 시 rollback 처리를 자동으로 수행 트랜잭션의 4가지 성질 원자성 → 한 트랜잭션 내에서 실행한 작업들은 하나의 단위로 처리함. 즉, 모두 성공 또는 모두 실패 일관성 → 일관성 있는 데이터베이스 상태를 유지 격리성 →...","categories": ["SpringBoot"],
        "tags": ["Java","SpringBoot","JPA"],
        "url": "/springboot/Java-Transactional/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "예외처리 (Exception)",
        "excerpt":"1. Checked Exception RuntimeException 을 상속받지 않는 예외 예외 발생 시 롤백을 진행하지 않음 2. Unchecked Exception RuntimeException 을 상속받는 예외 예외 발생 시 롤백 진행 참고) 오류 (Error) 예외란 개발자가 로직을 잘못 짰거나 사용자가 잘못된 값을 넘겨 정상적인 프로그램 흐름에 벗어나는 행위를 말함. 미리 예측하여 예외를 잡을 수 있다....","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-Exception/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "의존성 주입, 3가지 방법",
        "excerpt":"의존성 주입 방법 1. field injection field injection 은 의존성을 주입하고 싶은 필드에 @Autowired 를 붙여주면 의존성이 주입된다. @Service public class MemberService { @Autowired private MemberRepository memberRepository; } 2. setter based injection setter 메서드에 @Autowired 를 붙여 의존성을 주입하는 방식 @Service public class MemberService { private MemberRepository memberRepository; @Autowired public...","categories": ["SpringBoot"],
        "tags": ["Java","SpringBoot"],
        "url": "/springboot/Java-Injection/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "SpringBoot Settings",
        "excerpt":"1. SpringBoot Settings → spring boot 기반으로 셋팅 Spring Initializr 위의 사이트에서 기본적인 스프링 프로젝트 셋팅을 할 수 있다 설정 시 Dependencies 에서 spring web Thymeleaf spring data jpa h2 database lombok 를 선택 후 GENERATE! 위에서 GENERATE 한 파일을 IntelliJ 에서 Open! → build.gradle 파일을 Open 2. IntelliJ Gradle...","categories": ["SpringBoot"],
        "tags": ["Java","SpringBoot"],
        "url": "/springboot/Java-SpringBoot-Settings/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "JPA Intro",
        "excerpt":"JPA package jpabook.start; import javax.persistence.*; import java.util.List; public class JpaMain { public static void main(String[] args) { //엔티티 매니저 팩토리 생성 EntityManagerFactory emf = Persistence.createEntityManagerFactory(\"jpabook\"); EntityManager em = emf.createEntityManager(); //엔티티 매니저 생성 EntityTransaction tx = em.getTransaction(); //트랜잭션 기능 획득 try { tx.begin(); //트랜잭션 시작 logic(em); //비즈니스 로직 tx.commit();//트랜잭션 커밋 }...","categories": ["JPA"],
        "tags": ["Java","JPA"],
        "url": "/jpa/Java-JPA-Intro/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "[점프투자바] 객체지향 개념1",
        "excerpt":"객체지향 언어 재사용성과 유지보수 그리고 중복된 코드의 제거, 이 세 가지 관점에서 보면 보다 쉽게 이해할 수 있음 너무 객체지향개념에 얽매여서 고민하기 보다는 일단 프로그램을 기능적으로 완성한 다음 어떻게 하면 보다 객체지향적으로 코드를 개선할 수 있을지를 고민하여 점차 개선해나가는 것이 좋다 클래스 ‘동물’이라는 클래스 Animal.java public class Animal { }...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-OOP1/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "변경감지와 병합 - 첫번째",
        "excerpt":"준영속 이란? → 영속성 컨텍스트가 관리하는 영속 상태의 엔티티가 영속성 컨텍스트에서 분리된(detached) 것을 준영속 상태라 한다 영속 상태 엔티티를 준영속 상태로 만드는 방법 em.detach(entity): 특정 엔티티만 준영속 상태로 전환 em.clear(): 영속성 컨텍스트를 완전히 초기화 em.close(): 영속성 컨텍스트를 종료 준영속 엔티티란? 영속성 컨텍스트가 더는 관리하지 않는 엔티티를 말한다 준영속이라는 단어는 객체를...","categories": ["JPA"],
        "tags": ["Java","SpringBoot","JPA"],
        "url": "/jpa/Java-DirtyChecking1/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "엔티티 매핑",
        "excerpt":"JPA 를 사용하는 데 가장 중요한 일은 엔티티와 테이블을 정확히 매핑하는 것. 따라서, 매핑 어노테이션을 숙지하고 사용해야 함 대표 어노테이션 객체와 테이블 매핑: @Entity, @Table 기본 키 매핑: @Id 필드와 컬럼 매핑: @Column 연관관계 매핑: @ManyToOne, @JoinColumn @Entity JPA 를 사용해서 테이블과 매핑할 클래스는 @Entity 어노테이션을 필수로 붙여야함 @Entity 가...","categories": ["JPA"],
        "tags": ["Java","SpringBoot","JPA"],
        "url": "/jpa/Java-Entity-Mapping/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "변경감지와 병합 - 두번째",
        "excerpt":"SQL 수정(Update) 쿼리의 문제점 SQL 을 사용하면 수정 쿼리를 직접 작성 프로젝트의 규모가 커지고 요구사항이 늘어나면 수정쿼리도 점점 추가된다. → 이 방식의 문제점은 수정 쿼리가 많아지는 것과 비지니스 로직을 분석하기 위해 SQL 을 계속 확인해야함. 결국, 직접적이든 간접적이든 비지니스 로직이 SQL 에 의존하게 됨 // 초기 update member set name...","categories": ["JPA"],
        "tags": ["Java","SpringBoot","JPA"],
        "url": "/jpa/Java-DirtyChecking2/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "JPA Repository",
        "excerpt":"ItemRepository.java package com.shop.shop.repository; import com.shop.shop.entity.Item; import org.springframework.data.jpa.repository.JpaRepository; public interface ItemRepository extends JpaRepository&lt;Item, Long&gt; { } JpaRepository JpaReporitory 는 2개의 제네릭 타입을 사용하는데 첫번째에는 엔티티 타입 클래스, 두번재는 기본키 타입을 넣어줌 JpaReporitory 는 기본적인 CRUD 및 페이징 처리를 위한 메소드가 정의돼 있음 JpaReporitory 에서 지원하는 메소드 예시 application-test.properties # Datasource 설정...","categories": ["JPA"],
        "tags": ["Java","SpringBoot","JPA"],
        "url": "/jpa/Java-JPARepository/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Nginx 를 이용하여 SpringBoot 무중단 배포하기",
        "excerpt":"참고) 스프링 부트와 AWS로 혼자 구현하는 웹서비스 [SpringBoot] 웹서비스 출시하기 - 5. Nginx를 활용한 무중단 배포 구축하기 1. 구조 Nginx 1대, 스프링부트 jar 2대 Nginx에는 80(http), 443(https) 포트를 할당합니다. 스프링부트 jar1에는 8081포트로 , 스프링부트 jar2에는 8082포트로 실행합니다.(포트는 원하시는 포트를 사용하시면 됩니다.) 구조는 아래의 그림같이 형성 위 그림의 동작 과정 사용자는...","categories": ["SpringBoot"],
        "tags": ["Java","SpringBoot","Nginx"],
        "url": "/springboot/Java-Nginx-SpringBoot/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Spring Profile 이란?",
        "excerpt":"개발환경에 따라 설정파일을 다르게 로딩해야할 필요가 있다 이처럼 Profile 은 어떤 특정 환경의 설정 값을 다르게 하고 싶을 때 사용 예를 들어, 테스트 환경과 배포 환경을 다르게 두고 Profile 설정 기본적인 profile 정보 application.properties application.yml 여기서 특정 규칙에 만족하게 설정 파일을 만들면 SpringBoot 가 읽어올 수 있다. application-{프로필네임키워드}.properties ex. application-dev.properties...","categories": ["SpringBoot"],
        "tags": ["Java","SpringBoot"],
        "url": "/springboot/Java-SpringProfile/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "JPA 자동으로 처리되는 날짜/시간 설정",
        "excerpt":"엔티티와 관련된 작업을 하다 보면, 데이터의 등록/수정 시간을 자동으로 처리할 수 있도록 어노테이션을 이용해서 설정 entity/BaseEntity.java package org.zerock.ex2.entity; import lombok.Getter; import org.springframework.data.annotation.CreatedDate; import org.springframework.data.annotation.LastModifiedDate; import org.springframework.data.jpa.domain.support.AuditingEntityListener; import javax.persistence.Column; import javax.persistence.EntityListeners; import javax.persistence.MappedSuperclass; import java.time.LocalDateTime; @MappedSuperclass @EntityListeners(value = {AuditingEntityListener.class}) @Getter abstract class BaseEntity { @CreatedDate @Column(name = \"regdate\", updatable = false)...","categories": ["JPA"],
        "tags": ["Java","SpringBoot","JPA"],
        "url": "/jpa/Java-JPA-AutoDate/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "페이징/정렬 처리하기",
        "excerpt":"페이징 처리와 정렬은 전통적으로 SQL 을 공부하는데 반드시 필요한 부분. 특히 페이지 처리는 데이터베이스의 종류에 따라서 사용되는 기법이 다른 경우가 많아서 별도의 학습이 필요 JPA 는 내부적으로 이런 처리를 Dialect 라는 존재를 이용해서 처리. 예를 들어 JDBC 정보가 예제와 같이 MariaDB 의 경우에는 자동으로 MariaDB 를 위한 Dialect 가 설정됨...","categories": ["JPA"],
        "tags": ["Java","SpringBoot","JPA"],
        "url": "/jpa/Java-JPA-Paging/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "쿼리 메서드 (Query Methods) 기능과 @Query",
        "excerpt":"쿼리 메서드와 JPQL(Java Persistence Query Language) 은 객체 지향 쿼리 Spring Data JPA 는 다양한 검색 조건을 위해 다음과 같은 방법 제공 쿼리 메서드: 메서드의 이름 자체가 쿼리의 구문으로 처리되는 기능 @Query: SQL 과 유사하게 엔티티 클래스의 정보를 이용해서 쿼리를 작성하는 기능 Querydsl 등의 동적 쿼리 처리 기능 쿼리 메서드(Query...","categories": ["JPA"],
        "tags": ["Java","SpringBoot","JPA"],
        "url": "/jpa/Java-JPA-QueryMethod/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "객체지향개념(객체지향언어, 클래스와 객체)",
        "excerpt":"1. 객체지향언어 1.1 객체지향언어의 역사 80년 초 소프트웨어의 위기(c언어, fortran, cobol 등) - 빠른 변화를 못쫓아감 해결책으로 객체지향 언어를 도입(절차적 → 객체지향) 참고) c언어 + 객체지향 개념 ⇒ c++ ⇒ java 1.2 객체지향언어 코드의 재사용성이 높고 유지보수가 용이, 중복 코드 제거 객체지향 언어 = 프로그래밍 언어 + 객체지향개념(규칙) OOP (Object-Oriented...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-OOP/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Spring Security",
        "excerpt":"스프링 시큐리티 → 다양한 방식으로 사용자 정보를 유지할 수 있는 방법을 제공 세션(HttpSession) 기반: 사용자 정보는 서버에서 보관, 필요시 설정을 통해서 제어 1. 스프링 시큐리티를 이용하는 프로젝트 build.gradle implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity5' application.yml logging: level: com: springframework: security: web: trace project: debug security 관련 부분은 로그 레벨을 낮게 설정해서 자세한 로그 확인...","categories": ["SpringBoot"],
        "tags": ["Java","SpringBoot","JPA"],
        "url": "/springboot/Java-SpringSecurity/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "객체지향개념(변수와 메서드)",
        "excerpt":"3. 변수와 메서드 3.1 선언위치에 따른 변수의 종류 영역엔 두가지가 있다. 클래스 영역: 인스턴스 변수(iv), 클래스 변수(cv = static + iv) 메서드 영역: 지역 변수(lv) class Variables { // 변수선언 시작 int iv; // 인스턴스 변수 static int cv; // 클래스 변수(static변수, 공유변수) // 변수 선언 끝 // 메서드 선언...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-OOP2/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "객체지향개념(호출스택, 기본형/참조형 매개변수, 참조형 반환타입, 클래스/인스턴스 메서드)",
        "excerpt":"3.7 JVM의 메모리 구조 JVM은 메모리를 용도에 따라 여러 영역으로 나누어 관리한다. 주요 3가지 영역은 메서드영역, 호출스택, 힙이 있다. 그 중 호출 스택에 대해 알아본다 스택(stack): 밑이 막힌 상자. 위에 차곡차곡 쌓인다. 호출스택(call stack)이란?(중요) 메서드 수행에 필요한 메모리가 제공되는 공간 메서드가 호출되면 호출스택에 메모리 할당, 메서드가 작업을 종료하면 할당되었던 메모리...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-OOP3/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "Git 자주쓰는 명령어 정리",
        "excerpt":"사용자 정보 설정 # repository 마다 사용자 정보 설정 git config --local user.email \"yessm621@gmail.com\" git config --local user.name \"yessm621\" # 전역(Global)으로 설정 git config --global user.email \"nohsm621@coreintec.com\" git config --global user.name \"nohsm621\" ssh-keygen ssh-keygen -t rsa -b 4096 -C \"nohsm621@coreintec.com\" ssh key 암호 없애기 및 변경하기 - git pull 할...","categories": ["Git"],
        "tags": ["Git"],
        "url": "/git/Git-Command/",
        "teaser": "/assets/images/IMG_2153.JPG"
      },{
        "title": "객체지향개념(오버로딩, 생성자, 생성자 this(), 참조변수 this, 변수의 초기화)",
        "excerpt":"4. 메서드 오버로딩 4.1 메서드 오버로딩이란? 한 클래스 안에 같은 이름의 메서드 여러 개 정의하는 것 대표적인 것: println() 파라미터(매개변수)만 다르다 void println() void println(boolean x) void println(char x) void println(char[] x) void println(double x) void println(float x) void println(int x) void println(long x) void println(Object x) void println(String x)...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-OOP4/",
        "teaser": "/assets/images/IMG_2153.JPG"
      }]
