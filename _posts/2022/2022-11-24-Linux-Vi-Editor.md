---
title:  "[CentOS] vi 편집기 꾸미기"
last_modified_at: 2022-11-24T13:40:00
categories: 
  - Linux
tags:
  - Linux
---

vi 편집기를 이쁘게 꾸며보겠다.

우선 vim을 설치하고 alias를 설정해 vi를 vim으로 변경하겠다.

아래 명령어를 통해 vim 설치한다.

```bash
yum install vim
```

alias 설정하기 위해 .bashrc 파일을 수정한다.

```bash
vi ~/.bashrc
```

아래 코드를 넣고 :wq로 저장하고 나온다.

```bash
alias vi='vim'
```

수정한 .bashrc 파일을 적용한다.

```bash
source ~/.bashrc
```

이제 Syntax Highlighting을 설정하기 위해 colorscheme를 선택한다. 필자는 jellybeans 테마를 선택했다.

아래 경로에 선택한 colorscheme를 넣는다.

(다운로드 링크) [jellybeans.vim](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6a5b147d-c1e7-485c-92dc-09dcbadd0081/jellybeans.vim)

```bash
 cd /usr/share/vim/vim74/colors/
```

> **참고**
<br>
mac에서 적용할 때는 ~/.vim/colors 폴더에 테마를 넣으면 된다.
>


그리고 root 경로에 있는 .vimrc 파일을 수정한다. (없으면 새로 만들어도 된다.)

```bash
vi ~/.vimrc
```

.vimrc 파일에 아래 내용 입력하고 :wq로 저장하고 나온다.

```bash
set hlsearch " 검색어 하이라이팅
set nu " 줄번호
set autoindent " 자동 들여쓰기
set scrolloff=2
set wildmode=longest,list
set ts=4 "tag select
set sts=4 "st select
set sw=1 " 스크롤바 너비
set autowrite " 다른 파일로 넘어갈 때 자동 저장
set autoread " 작업 중인 파일 외부에서 변경됬을 경우 자동으로 불러옴
set cindent " C언어 자동 들여쓰기
set bs=eol,start,indent
set history=256
set laststatus=2 " 상태바 표시 항상
"set paste " 붙여넣기 계단현상 없애기
set shiftwidth=4 " 자동 들여쓰기 너비 설정
set showmatch " 일치하는 괄호 하이라이팅
set smartcase " 검색시 대소문자 구별
set smarttab
set smartindent
set softtabstop=4
set tabstop=4
set ruler " 현재 커서 위치 표시
set incsearch
set statusline=\ %<%l:%v\ [%P]%=%a\ %h%m%r\ %F\ 
" 마지막으로 수정된 곳에 커서를 위치함
au BufReadPost *
\ if line("'\"") > 0 && line("'\"") <= line("$") |
\ exe "norm g`\"" |
\ endif
" 파일 인코딩을 한국어로
if $LANG[0]=='k' && $LANG[1]=='o'
set fileencoding=korea
endif
" 구문 강조 사용
if has("syntax")
 syntax on
endif

colorscheme jellybeans
```

이제 아래와 같이 보기 좋은 vi 편집기를 볼 수 있다.

![스크린샷 2022-11-24 오후 1 35 16](https://user-images.githubusercontent.com/79130276/203695613-b1c64877-986f-4dcf-9b77-7de8896396a0.png)