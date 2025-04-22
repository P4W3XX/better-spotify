export default function PopularCover({
    title,
    artist,
}: {
    title: string
    artist?: string
}) {
    return (
        <div className="
          flex flex-col w-full
          relative group cursor-pointer
          transition-all duration-200 z-0
        ">
            <div className="
              relative w-full aspect-[4/3]
              overflow-hidden rounded-3xl
              bg-black
            ">
                <div className="
                  absolute inset-0
                  bg-gradient-to-t from-black/50
                  z-40 rounded-3xl
                " />
                <div
                    style={{ backgroundImage: `url('/${artist}.jpg')` }}
                    className="
                      absolute inset-0
                      bg-cover bg-top
                      transition-transform scale-105 group-active:scale-100 duration-300 ease-out
                      group-hover:scale-110
                    "
                />
                <svg
                    className="absolute top-2 left-2 z-50"
                    width="42" height="42" viewBox="0 0 42 42"
                    fill="none" xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd" clipRule="evenodd"
                        d="M21 0C9.40202 0 0 9.40202 0 21C0 32.598 9.40202 42 21 42C32.598 42 42 32.598 42 21C42 9.40202 32.598 0 21 0ZM28.2102 25.2079V16.8018C28.2102 15.8075 27.4032 15.0006 26.4089 15.0006C25.4146 15.0006 24.6076 15.8075 24.6076 16.8018V25.2079C24.6076 26.2022 25.4146 27.0091 26.4089 27.0091C27.4032 27.0091 28.2102 26.2022 28.2102 25.2079ZM18.6033 8.39583C18.6033 7.40152 19.4103 6.59454 20.4046 6.59454C21.3989 6.59454 22.2059 7.40152 22.2059 8.39583V33.6139C22.2059 34.6082 21.3989 35.4152 20.4046 35.4152C19.4103 35.4152 18.6033 34.6082 18.6033 33.6139V8.39583ZM30.6119 13.1993C30.6119 12.205 31.4189 11.398 32.4132 11.398C33.4075 11.398 34.2145 12.205 34.2145 13.1993V28.8104C34.2145 29.8048 33.4075 30.6117 32.4132 30.6117C31.4189 30.6117 30.6119 29.8048 30.6119 28.8104V13.1993ZM12.599 14.4001C12.599 13.4058 13.406 12.5988 14.4003 12.5988C15.3946 12.5988 16.2016 13.4058 16.2016 14.4001V27.6096C16.2016 28.6039 15.3946 29.4109 14.4003 29.4109C13.406 29.4109 12.599 28.6039 12.599 27.6096V14.4001ZM6.5947 19.2036C6.5947 18.2093 7.40168 17.4023 8.39599 17.4023C9.3903 17.4023 10.1973 18.2093 10.1973 19.2036V22.8061C10.1973 23.8005 9.3903 24.6074 8.39599 24.6074C7.40168 24.6074 6.5947 23.8005 6.5947 22.8061V19.2036Z"
                        fill="white"
                    />
                </svg>
                <h1 className="
                  absolute bottom-4 left-4 z-50
                  text-white font-semibold
                  text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                  w-3/4
                ">
                    {title}
                </h1>
            </div>
        </div>
    )
}