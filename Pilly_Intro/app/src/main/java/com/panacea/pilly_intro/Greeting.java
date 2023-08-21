package com.panacea.pilly_intro;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ArgbEvaluator;
import android.animation.ObjectAnimator;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class Greeting extends AppCompatActivity {
    private View rootView;
    private ImageView humanGreeting;
    private int widthDisplay;
    private int heightDisplay;
    private TextCharacterRevealView txtHi;
    private RelativeLayout.LayoutParams lpHumanGreeting;
    private ObjectAnimator startGreeting;
    private ObjectAnimator fadeOutHi;
    private float widthSearchImage;
    private float wHBarCode;
    private ObjectAnimator titleFadeIn;
    private ObjectAnimator fadeOutPilly;


    private ObjectAnimator fadeOutSearchImg;
    private ObjectAnimator fadeOutTxtSearchAMed;
    private ObjectAnimator fadeOutStart;
    private ObjectAnimator rotateSearchImg;
    private ObjectAnimator transSearchImg;
    private ObjectAnimator fadeOutYouCan;
    private ObjectAnimator movePersonOut;
    private ObjectAnimator fadeInOr;
    private ObjectAnimator fadeOutOr;

    private ObjectAnimator backgroundAnim;


    private ObjectAnimator fadeOutTxtScan;
    private ObjectAnimator fadeOutBarCode;
    private ObjectAnimator entryPerson;
    private ObjectAnimator barCodeEntry;

    private TextCharacterRevealView txtStart;
    private TextCharacterRevealView txtYouCan;
    private TextCharacterRevealView txtPilly;
    private TextView title;
    private ImageView person;
    private ImageView searchImage;
    private ImageView barCodeImage;
    private TextCharacterRevealView txtSearchAMed;
    private TextView txtOr;
    private TextCharacterRevealView txtScanAMed;
    private TextCharacterRevealView txtBeOnTime;

    private Button dismiss;

    private Typeface blackItalicRoboto;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        findDisplayDimensions();
        retrieveTypeface();
        findViews();
        retrieveLayoutParams();
        retrieveViewDimensions();
        initializeViewDimensions();
        setUpTxt();
        setUpAnimations();
        initializeViewPositions();
        setUpAnimationListeners2();
        setUpButtons();
        setContentView(rootView);
    }

    private void setUpButtons() {
        /*No Main Activity Here,Just Intro
        dismiss.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(Greeting.this, MainActivity.class));
                finish();
            }
        });*/
    }

    private void retrieveViewDimensions() {
        widthSearchImage =
                getResources()
                        .getDimension(R.dimen.width_height_image_view_home_tab);
        wHBarCode =
                getResources()
                        .getDimension(R.dimen.width_height_bar_code_scan_image_home_tab);
    }


    private void setUpAnimationListeners2() {
        startGreeting.addListener(new EndAnimationListenerAdapter(txtHi, null));
        txtHi.setFinishRevealListener(new EndAnimationListenerAdapter(txtPilly, null));
        txtPilly.setFinishRevealListener(new EndAnimationListenerAdapter(null, new Animator[]{fadeOutHi}));
        fadeOutHi.addListener(new EndAnimationListenerAdapter(null, new Animator[]{fadeOutPilly}));
        fadeOutPilly.addListener(new EndAnimationListenerAdapter(txtStart, null));
        txtStart.setFinishRevealListener(new EndAnimationListenerAdapter(null, new Animator[]{fadeOutStart, movePersonOut}));
        fadeOutStart.addListener((new EndAnimationListenerAdapter(txtYouCan, null)));
        txtYouCan.setFinishRevealListener((new EndAnimationListenerAdapter(null, new Animator[]{fadeOutYouCan})));
        fadeOutYouCan.addListener((new EndAnimationListenerAdapter(null,
                new Animator[]{rotateSearchImg, transSearchImg})));
        transSearchImg.addListener(new EndAnimationListenerAdapter(txtSearchAMed, null));
        txtSearchAMed.setFinishRevealListener((new EndAnimationListenerAdapter(null, new Animator[]{fadeOutTxtSearchAMed,
                fadeOutSearchImg})));
        fadeOutSearchImg.addListener(new EndAnimationListenerAdapter(null, new Animator[]{fadeInOr}));
        fadeInOr.addListener(new EndAnimationListenerAdapter(null, new Animator[]{fadeOutOr}));
        fadeOutOr.addListener(new EndAnimationListenerAdapter(null, new Animator[]{barCodeEntry}));
        barCodeEntry.addListener(new EndAnimationListenerAdapter(txtScanAMed, null));
        txtScanAMed.setFinishRevealListener((new EndAnimationListenerAdapter(null, new Animator[]{fadeOutBarCode,
                fadeOutTxtScan})));
        fadeOutTxtScan.addListener(new EndAnimationListenerAdapter(null, new Animator[]{entryPerson}));
        entryPerson.addListener(new EndAnimationListenerAdapter(txtBeOnTime, null));
    }

    private void setUpAnimations() {
        final int aliceBlue = Color.parseColor("#EDF2F4");
        backgroundAnim = ObjectAnimator.ofInt(rootView, "BackgroundColor",
                Color.WHITE, aliceBlue, Color.WHITE);
        backgroundAnim.setEvaluator(new ArgbEvaluator());
        backgroundAnim.setRepeatCount(ObjectAnimator.INFINITE);
        backgroundAnim.setDuration(1500);

        startGreeting = ObjectAnimator.ofFloat(humanGreeting, "Y", heightDisplay,
                heightDisplay - lpHumanGreeting.height);
        startGreeting.setStartDelay(1000);
        startGreeting.setDuration(2000);

        movePersonOut = ObjectAnimator.ofFloat(humanGreeting, "Y", heightDisplay - lpHumanGreeting.height,
                heightDisplay);
        fadeOutHi = ObjectAnimator.ofFloat(txtHi, "alpha", 1, 0);
        fadeOutHi.setStartDelay(5000);

        fadeOutPilly = ObjectAnimator.ofFloat(txtPilly, "alpha", 1, 0);

        titleFadeIn = ObjectAnimator.ofFloat(title, "alpha", 0, 1);
        titleFadeIn.setDuration(2000);

        fadeOutStart = ObjectAnimator.ofFloat(txtStart, "alpha", 1, 0);

        rotateSearchImg = ObjectAnimator.ofFloat(searchImage, "Rotation", 0, 360);
        rotateSearchImg.setDuration(2000);
        float endX = (float) widthDisplay / (float) 2 - widthSearchImage / (float) 2;
        transSearchImg = ObjectAnimator.ofFloat(searchImage, "X",
                -widthSearchImage, endX);

        transSearchImg.setDuration(2000);

        fadeOutYouCan = ObjectAnimator.ofFloat(txtYouCan, "alpha", 1, 0);

        fadeOutTxtSearchAMed = ObjectAnimator.ofFloat(txtSearchAMed, "Alpha", 1, 0);
        fadeOutTxtSearchAMed.setStartDelay(500);
        fadeOutSearchImg = ObjectAnimator.ofFloat(searchImage, "alpha", 1, 0);
        fadeOutSearchImg.setStartDelay(500);

        fadeInOr = ObjectAnimator.ofFloat(txtOr, "alpha", 0, 1);
        fadeOutOr = ObjectAnimator.ofFloat(txtOr, "alpha", 1, 0);
        fadeOutOr.setStartDelay(1000);

        barCodeEntry = ObjectAnimator.ofFloat(barCodeImage, "Y", -wHBarCode, wHBarCode);
        fadeOutBarCode = ObjectAnimator.ofFloat(barCodeImage, "Alpha", 1, 0);
        fadeOutBarCode.setStartDelay(500);
        fadeOutTxtScan = ObjectAnimator.ofFloat(txtScanAMed, "Alpha", 1, 0);
        fadeOutTxtScan.setStartDelay(500);
        entryPerson = ObjectAnimator.ofFloat(person, "Y", (float) heightDisplay,
                (float) heightDisplay - widthSearchImage);
    }


    class EndAnimationListenerAdapter extends AnimatorListenerAdapter
            implements TextCharacterRevealView.OnFinishRevealListener {
        private TextCharacterRevealView textCharacterRevealView;
        private Animator[] animators;
        public EndAnimationListenerAdapter(TextCharacterRevealView textCharacterRevealView,
                                           Animator[] animator) {
            this.textCharacterRevealView = textCharacterRevealView;
            this.animators = animator;
        }
        @Override
        public void onFinishReveal() {
            if (textCharacterRevealView != null) textCharacterRevealView.restartReveal();
            if (animators != null) for (Animator anim : animators) anim.start();
        }
        @Override
        public void onAnimationEnd(Animator animation) {
            super.onAnimationEnd(animation);
            if (textCharacterRevealView != null) textCharacterRevealView.restartReveal();
            if (animators != null) for (Animator anim : animators) anim.start();
        }
    }


    @Override
    protected void onResume() {
        super.onResume();
        startGreeting.start();
        backgroundAnim.start();
    }

    private RelativeLayout.LayoutParams lpPerson;

    private void retrieveLayoutParams() {
        lpHumanGreeting =
                (RelativeLayout.LayoutParams) humanGreeting.getLayoutParams();
        lpPerson =
                (RelativeLayout.LayoutParams) person.getLayoutParams();
    }


    public float convertDpToPixel(float dp) {
        DisplayMetrics metrics = Resources.getSystem().getDisplayMetrics();
        float px = dp * (metrics.densityDpi / 160f);
        return Math.round(px);
    }

    private void initializeViewPositions() {
        humanGreeting.setY(heightDisplay);
        person.setY(heightDisplay);
        searchImage.setX(-widthSearchImage);
        barCodeImage.setY(-wHBarCode);
        txtScanAMed.setY(wHBarCode * 2 + convertDpToPixel(10));
        person.setY((float) heightDisplay);
    }

    private void initializeViewDimensions() {
        int w_h_hG = (int) ((float) widthDisplay * (7.0f / 8.0f));
        lpHumanGreeting.width = w_h_hG;
        lpHumanGreeting.height = w_h_hG;
    }

    private void findDisplayDimensions() {
        DisplayMetrics metrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metrics);
        widthDisplay = metrics.widthPixels;
        heightDisplay = metrics.heightPixels;
    }
    private void findViews() {
        rootView = getLayoutInflater().inflate(R.layout.greeting, null);
        humanGreeting = rootView.findViewById(R.id.human_greeting_view);
        txtHi = rootView.findViewById(R.id.txt_hi);
        txtPilly = rootView.findViewById(R.id.txt_pilly);
        title = rootView.findViewById(R.id.title);
        person = rootView.findViewById(R.id.silhoutteImage);
        txtStart = rootView.findViewById(R.id.txt_start);
        txtYouCan = rootView.findViewById(R.id.txt_youCan);
        searchImage = rootView.findViewById(R.id.searchImage);
        barCodeImage = rootView.findViewById(R.id.barCodeScanImage);
        txtSearchAMed = rootView.findViewById(R.id.txt_search_a_med);
        txtOr = rootView.findViewById(R.id.txt_or);
        barCodeImage = rootView.findViewById(R.id.barCodeScanImage);
        txtScanAMed = rootView.findViewById(R.id.txt_scan_a_med);
        txtBeOnTime = rootView.findViewById(R.id.txt_be_on_time);
        dismiss = rootView.findViewById(R.id.dismiss);
    }

    private void setUpTxt() {

        txtHi.setText("Hi,\nI'm");
        txtHi.setTxtStyle(Paint.Style.FILL);
        txtHi.setTxtColor(Color.GRAY);
        txtHi.setTextSizeDp(70);
        int colorPilly = Color.parseColor("#0d47a1");

        txtPilly.setText("Pilly");
        txtPilly.setTxtStyle(Paint.Style.FILL);
        txtPilly.setTxtColor(colorPilly);
        txtPilly.setTextSizeDp(70);

        txtStart.setText("Let's get\nStarted!");
        txtStart.setTxtStyle(Paint.Style.FILL);
        txtStart.setTextSizeDp(50);
        txtStart.setTxtColor(Color.GRAY);
        txtYouCan.setText("You can...");
        txtYouCan.setTxtStyle(Paint.Style.FILL);
        txtYouCan.setTextSizeDp(70);
        txtYouCan.setTxtColor(Color.GRAY);
        txtSearchAMed.setText("Search a\nMed..");
        txtSearchAMed.setTxtStyle(Paint.Style.FILL);
        txtSearchAMed.setTextSizeDp(60);
        txtSearchAMed.setTxtColor(Color.GRAY);

        txtOr.setText("Or..");
        txtOr.setTextColor(Color.GRAY);
        txtOr.setTypeface(blackItalicRoboto);

        txtScanAMed.setText("Scan a\nMed...");
        txtScanAMed.setTxtStyle(Paint.Style.FILL);
        txtScanAMed.setTextSizeDp(60);
        txtScanAMed.setTxtColor(Color.GRAY);
        txtBeOnTime.setText("Be On Time!");
        txtBeOnTime.setTxtStyle(Paint.Style.FILL);
        txtBeOnTime.setTextSizeDp(60);
        txtBeOnTime.setTxtColor(Color.GRAY);
    }

    private void retrieveTypeface() {
        blackItalicRoboto = Typeface.createFromAsset
                (getResources().getAssets(), "fonts/Roboto-BlackItalic.ttf");
    }
}

